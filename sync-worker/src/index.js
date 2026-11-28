const NOTION_VERSION = "2025-09-03";
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...headers } });
}
function corsHeaders(origin, env) {
  const allowed = (env.APP_ORIGIN || "").split(",").map(x => x.trim()).filter(Boolean);
  return {
    "access-control-allow-origin": allowed.includes(origin) ? origin : "null",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "authorization,content-type",
    "access-control-max-age": "86400",
    "vary": "Origin"
  };
}
function richText(value) {
  return [{ type: "text", text: { content: String(value ?? "").slice(0, 1900) } }];
}
async function notion(env, path, method = "GET", body) {
  const response = await fetch("https://api.notion.com/v1" + path, {
    method,
    headers: {
      authorization: "Bearer " + env.NOTION_TOKEN,
      "notion-version": NOTION_VERSION,
      "content-type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Notion API request failed");
    error.status = response.status;
    error.code = data.code || "notion_error";
    throw error;
  }
  return data;
}
function titleText(page, property) {
  return page?.properties?.[property]?.title?.[0]?.plain_text || "";
}
function numberValue(page, property) {
  return page?.properties?.[property]?.number ?? 0;
}
async function queryByTitle(env, sourceId, property, value) {
  const result = await notion(env, `/data_sources/${sourceId}/query`, "POST", {
    filter: { property, title: { equals: value } },
    page_size: 10
  });
  return result.results || [];
}
async function queryByText(env, sourceId, property, value) {
  const result = await notion(env, `/data_sources/${sourceId}/query`, "POST", {
    filter: { property, rich_text: { equals: value } },
    page_size: 100
  });
  return result.results || [];
}
function statePayload(page) {
  const p = page.properties || {};
  return {
    pageId: page.id,
    topicId: titleText(page, "Topic ID"),
    title: p["Tên chủ đề"]?.rich_text?.[0]?.plain_text || "",
    map: p["Bản đồ"]?.rich_text?.[0]?.plain_text || "",
    lightLevel: numberValue(page, "Cấp ánh sáng"),
    forgetCount: numberValue(page, "Số lần quên"),
    learned: p["Đã học"]?.checkbox || false,
    status: p["Trạng thái"]?.select?.name || "Chưa khai mở",
    updatedAt: p["Cập nhật lúc"]?.date?.start || null,
    device: p["Thiết bị cập nhật"]?.rich_text?.[0]?.plain_text || "",
    revision: numberValue(page, "Revision"),
    schemaVersion: numberValue(page, "Schema version"),
    payload: p["Payload JSON"]?.rich_text?.[0]?.plain_text || "{}"
  };
}
async function handle(request, env) {
  const url = new URL(request.url);
  if (request.method === "GET" && url.pathname === "/health") {
    return json({ ok: true, service: "sach-troi-sync", schemaVersion: 1 });
  }
  if (!env.NOTION_TOKEN || !env.APP_ACCESS_TOKEN || !env.TOPIC_STATE_SOURCE_ID || !env.EVENT_LOG_SOURCE_ID) {
    return json({ error: "server_not_configured" }, 503);
  }
  const auth = request.headers.get("authorization") || "";
  if (auth !== "Bearer " + env.APP_ACCESS_TOKEN) return json({ error: "unauthorized" }, 401);

  if (request.method === "GET" && url.pathname === "/v1/state") {
    const topicId = url.searchParams.get("topicId");
    if (!topicId) return json({ error: "topicId_required" }, 400);
    const rows = await queryByTitle(env, env.TOPIC_STATE_SOURCE_ID, "Topic ID", topicId);
    return json({ state: rows[0] ? statePayload(rows[0]) : null });
  }
  if (request.method === "GET" && url.pathname === "/v1/events") {
    const topicId = url.searchParams.get("topicId");
    if (!topicId) return json({ error: "topicId_required" }, 400);
    const rows = await queryByText(env, env.EVENT_LOG_SOURCE_ID, "Topic ID", topicId);
    return json({ events: rows.map(page => ({
      pageId: page.id,
      eventId: titleText(page, "Event ID"),
      topicId: page.properties["Topic ID"]?.rich_text?.[0]?.plain_text || "",
      type: page.properties["Loại sự kiện"]?.select?.name || "",
      occurredAt: page.properties["Thời điểm"]?.date?.start || null,
      beforeLevel: page.properties["Cấp trước"]?.number ?? null,
      afterLevel: page.properties["Cấp sau"]?.number ?? null,
      forgetCount: page.properties["Số lần quên"]?.number ?? 0,
      device: page.properties["Thiết bị"]?.rich_text?.[0]?.plain_text || "",
      evidence: page.properties["Bằng chứng"]?.rich_text?.[0]?.plain_text || "",
      payload: page.properties["Payload JSON"]?.rich_text?.[0]?.plain_text || "{}"
    })) });
  }
  if (request.method === "POST" && url.pathname === "/v1/events") {
    const input = await request.json();
    const required = ["eventId", "topicId", "type", "occurredAt"];
    if (required.some(k => !input[k])) return json({ error: "missing_required_fields", required }, 400);
    if (!["Học", "Đánh giá đạt", "Ôn nhớ tốt", "Quên", "Học lại", "Điều chỉnh cấp"].includes(input.type)) return json({ error: "invalid_event_type" }, 400);

    const duplicate = await queryByTitle(env, env.EVENT_LOG_SOURCE_ID, "Event ID", input.eventId);
    if (duplicate.length) return json({ ok: true, duplicate: true, eventId: input.eventId });

    const existing = await queryByTitle(env, env.TOPIC_STATE_SOURCE_ID, "Topic ID", input.topicId);
    const current = existing[0] ? statePayload(existing[0]) : null;
    const baseRevision = Number.isInteger(input.baseRevision) ? input.baseRevision : 0;
    const currentRevision = current?.revision || 0;
    if (baseRevision !== currentRevision) {
      return json({ error: "revision_conflict", currentRevision, currentState: current }, 409);
    }
    const next = input.state;
    if (!next || !Number.isInteger(next.lightLevel) || next.lightLevel < 0 || next.lightLevel > 5 ||
        !Number.isInteger(next.forgetCount) || next.forgetCount < 0) {
      return json({ error: "invalid_state" }, 400);
    }
    const revision = currentRevision + 1;
    const eventProperties = {
      "Event ID": { title: richText(input.eventId) },
      "Topic ID": { rich_text: richText(input.topicId) },
      "Tên chủ đề": { rich_text: richText(next.title || current?.title || input.topicId) },
      "Loại sự kiện": { select: { name: input.type } },
      "Thời điểm": { date: { start: input.occurredAt } },
      "Cấp trước": { number: input.beforeLevel ?? current?.lightLevel ?? 0 },
      "Cấp sau": { number: input.afterLevel ?? next.lightLevel },
      "Số lần quên": { number: next.forgetCount },
      "Thiết bị": { rich_text: richText(input.device || "unknown") },
      "Bằng chứng": { rich_text: richText(input.evidence || "") },
      "Payload JSON": { rich_text: richText(JSON.stringify(input.payload || {})) },
      "App version": { rich_text: richText(input.appVersion || "") }
    };
    await notion(env, "/pages", "POST", {
      parent: { type: "data_source_id", data_source_id: env.EVENT_LOG_SOURCE_ID },
      properties: eventProperties
    });

    const snapshot = {
      "Topic ID": { title: richText(input.topicId) },
      "Tên chủ đề": { rich_text: richText(next.title || current?.title || input.topicId) },
      "Bản đồ": { rich_text: richText(next.map || current?.map || "") },
      "Cấp ánh sáng": { number: next.lightLevel },
      "Số lần quên": { number: next.forgetCount },
      "Đã học": { checkbox: Boolean(next.learned) },
      "Trạng thái": { select: { name: next.status || "Đang học" } },
      "Cập nhật lúc": { date: { start: input.occurredAt } },
      "Thiết bị cập nhật": { rich_text: richText(input.device || "unknown") },
      "Revision": { number: revision },
      "Payload JSON": { rich_text: richText(JSON.stringify(next.payload || {})) },
      "Schema version": { number: 1 }
    };
    if (existing[0]) {
      await notion(env, `/pages/${existing[0].id}`, "PATCH", { properties: snapshot });
    } else {
      await notion(env, "/pages", "POST", {
        parent: { type: "data_source_id", data_source_id: env.TOPIC_STATE_SOURCE_ID },
        properties: snapshot
      });
    }
    return json({ ok: true, eventId: input.eventId, revision });
  }
  return json({ error: "not_found" }, 404);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const cors = corsHeaders(origin, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    try {
      const response = await handle(request, env);
      const headers = new Headers(response.headers);
      Object.entries(cors).forEach(([k, v]) => headers.set(k, v));
      return new Response(response.body, { status: response.status, headers });
    } catch (error) {
      return json({ error: "internal_error", detail: error.message, code: error.code || "unknown" }, error.status || 500, cors);
    }
  }
};
