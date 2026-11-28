const NOTION_VERSION = "2025-09-03";
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };
const EVENT_TYPES = ["Học", "Đánh giá đạt", "Ôn nhớ tốt", "Quên", "Học lại", "Điều chỉnh cấp"];

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
    const error = new Error("Notion API request failed");
    error.status = response.status;
    error.code = data.code || "notion_error";
    throw error;
  }
  return data;
}
function titleText(page, property) {
  return page?.properties?.[property]?.title?.[0]?.plain_text || "";
}
function richTextValue(page, property) {
  return page?.properties?.[property]?.rich_text?.[0]?.plain_text || "";
}
function numberValue(page, property) {
  return page?.properties?.[property]?.number ?? 0;
}
async function queryFirst(env, sourceId, property, kind, value) {
  const filter = kind === "title"
    ? { property, title: { equals: value } }
    : { property, rich_text: { equals: value } };
  const result = await notion(env, `/data_sources/${sourceId}/query`, "POST", { filter, page_size: 100 });
  return result.results || [];
}
async function queryAll(env, sourceId, property, value, cursor) {
  const body = { filter: { property, rich_text: { equals: value } }, page_size: 100 };
  if (cursor) body.start_cursor = cursor;
  return notion(env, `/data_sources/${sourceId}/query`, "POST", body);
}
function statePayload(page) {
  const p = page.properties || {};
  return {
    pageId: page.id,
    topicId: titleText(page, "Topic ID"),
    title: richTextValue(page, "Tên chủ đề"),
    map: richTextValue(page, "Bản đồ"),
    lightLevel: numberValue(page, "Cấp ánh sáng"),
    forgetCount: numberValue(page, "Số lần quên"),
    learned: p["Đã học"]?.checkbox || false,
    status: p["Trạng thái"]?.select?.name || "Chưa khai mở",
    updatedAt: p["Cập nhật lúc"]?.date?.start || null,
    device: richTextValue(page, "Thiết bị cập nhật"),
    revision: numberValue(page, "Revision"),
    schemaVersion: numberValue(page, "Schema version"),
    payload: richTextValue(page, "Payload JSON") || "{}"
  };
}
function makeSnapshot(input, current, revision) {
  const next = input.state;
  return {
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
}
async function writeSnapshot(env, existing, properties) {
  if (existing) {
    await notion(env, `/pages/${existing.id}`, "PATCH", { properties });
  } else {
    await notion(env, "/pages", "POST", {
      parent: { type: "data_source_id", data_source_id: env.TOPIC_STATE_SOURCE_ID },
      properties
    });
  }
}
async function findEvent(env, eventId) {
  const rows = await queryFirst(env, env.EVENT_LOG_SOURCE_ID, "Event ID", "title", eventId);
  return rows[0] || null;
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
    const rows = await queryFirst(env, env.TOPIC_STATE_SOURCE_ID, "Topic ID", "title", topicId);
    return json({ state: rows[0] ? statePayload(rows[0]) : null });
  }
  if (request.method === "GET" && url.pathname === "/v1/events") {
    const topicId = url.searchParams.get("topicId");
    if (!topicId) return json({ error: "topicId_required" }, 400);
    const cursor = url.searchParams.get("cursor") || undefined;
    const result = await queryAll(env, env.EVENT_LOG_SOURCE_ID, "Topic ID", topicId, cursor);
    return json({
      events: (result.results || []).map(page => ({
        pageId: page.id,
        eventId: titleText(page, "Event ID"),
        topicId: richTextValue(page, "Topic ID"),
        type: page.properties["Loại sự kiện"]?.select?.name || "",
        occurredAt: page.properties["Thời điểm"]?.date?.start || null,
        beforeLevel: page.properties["Cấp trước"]?.number ?? null,
        afterLevel: page.properties["Cấp sau"]?.number ?? null,
        forgetCount: page.properties["Số lần quên"]?.number ?? 0,
        device: richTextValue(page, "Thiết bị"),
        evidence: richTextValue(page, "Bằng chứng"),
        payload: richTextValue(page, "Payload JSON") || "{}"
      })),
      hasMore: Boolean(result.has_more),
      nextCursor: result.next_cursor || null
    });
  }
  if (request.method === "POST" && url.pathname === "/v1/events") {
    let input;
    try { input = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
    const required = ["eventId", "topicId", "type", "occurredAt", "state"];
    if (!input || required.some(k => !input[k])) return json({ error: "missing_required_fields", required }, 400);
    if (!EVENT_TYPES.includes(input.type)) return json({ error: "invalid_event_type" }, 400);
    const next = input.state;
    if (!Number.isInteger(next.lightLevel) || next.lightLevel < 0 || next.lightLevel > 5 ||
        !Number.isInteger(next.forgetCount) || next.forgetCount < 0) {
      return json({ error: "invalid_state" }, 400);
    }
    if (typeof input.eventId !== "string" || input.eventId.length > 200 ||
        typeof input.topicId !== "string" || input.topicId.length > 200) {
      return json({ error: "invalid_identifier" }, 400);
    }

    const existingEvent = await findEvent(env, input.eventId);
    const existingRows = await queryFirst(env, env.TOPIC_STATE_SOURCE_ID, "Topic ID", "title", input.topicId);
    const existingStatePage = existingRows[0] || null;
    const current = existingStatePage ? statePayload(existingStatePage) : null;
    const baseRevision = Number.isInteger(input.baseRevision) ? input.baseRevision : 0;
    const currentRevision = current?.revision || 0;

    // If a previous request wrote the event but failed before updating the snapshot,
    // retrying the same event ID can safely complete that snapshot write.
    if (existingEvent) {
      let saved = {};
      try { saved = JSON.parse(richTextValue(existingEvent, "Payload JSON") || "{}"); } catch {}
      if (saved.state && saved.topicId === input.topicId) {
        const targetRevision = Number(saved.baseRevision || 0) + 1;
        if (currentRevision === Number(saved.baseRevision || 0)) {
          await writeSnapshot(env, existingStatePage, makeSnapshot(saved, current, targetRevision));
          return json({ ok: true, duplicate: true, reconciled: true, eventId: input.eventId, revision: targetRevision });
        }
        if (currentRevision >= targetRevision) {
          return json({ ok: true, duplicate: true, reconciled: false, eventId: input.eventId, revision: currentRevision });
        }
      }
      return json({ ok: true, duplicate: true, eventId: input.eventId, revision: currentRevision });
    }
    if (baseRevision !== currentRevision) {
      return json({ error: "revision_conflict", currentRevision, currentState: current }, 409);
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
      "Payload JSON": { rich_text: richText(JSON.stringify({
        userPayload: input.payload || {}, state: next, topicId: input.topicId, baseRevision
      })) },
      "App version": { rich_text: richText(input.appVersion || "") }
    };
    await notion(env, "/pages", "POST", {
      parent: { type: "data_source_id", data_source_id: env.EVENT_LOG_SOURCE_ID },
      properties: eventProperties
    });
    await writeSnapshot(env, existingStatePage, makeSnapshot(input, current, revision));
    return json({ ok: true, eventId: input.eventId, revision });
  }
  return json({ error: "not_found" }, 404);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const allowed = (env.APP_ORIGIN || "").split(",").map(x => x.trim()).filter(Boolean);
    if (origin && !allowed.includes(origin)) return json({ error: "origin_not_allowed" }, 403);
    const cors = corsHeaders(origin, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    try {
      const response = await handle(request, env);
      const headers = new Headers(response.headers);
      Object.entries(cors).forEach(([k, v]) => headers.set(k, v));
      return new Response(response.body, { status: response.status, headers });
    } catch (error) {
      // Keep internal API details and secrets out of client responses.
      return json({ error: "internal_error", code: error.code || "upstream_error" }, error.status || 500, cors);
    }
  }
};
