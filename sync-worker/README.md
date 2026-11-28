# SÁCH TRỜI Sync Worker

This Worker is a private API adapter between the static SÁCH TRỜI app and the two Notion progress databases. Notion remains the progress store. No secrets are committed.

## Configuration

Set these Worker variables:
- `APP_ORIGIN`: exact GitHub Pages origin, currently `https://t7kpmjbbnp-byte.github.io`
- `TOPIC_STATE_SOURCE_ID`: `4265a63d-7bde-81e5-b46c-000bd7c29125`
- `EVENT_LOG_SOURCE_ID`: `4265a63d-7bde-81aa-932a-000bc27e497e`

Set these as encrypted Worker secrets (never as vars, in GitHub, or in frontend code):
- `NOTION_TOKEN`: Notion integration secret
- `APP_ACCESS_TOKEN`: long random bearer token

The Notion integration must be explicitly granted access to BOTH databases.

## Deploy

From this folder, with Wrangler installed and authenticated:
```sh
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put APP_ACCESS_TOKEN
npx wrangler deploy
``

Verify `GET https://YOUR-WORKER.workers.dev/health` returns `{"ok":true,"service":"sach-troi-sync","schemaVersion":1}`.

## API

All `/v1/*` endpoints require `Authorization: Bearer <APP_ACCESS_TOKEN>`.

- `GET /health` — public liveness check.
- `GET /v1/state?topicId=...` — topic snapshot.
- `GET /v1/events?topicId=...` — first event page.
- `GET /v1/events?topicId=...&cursor=...` — next event page; response includes `hasMore` and `nextCursor`.
- `POST /v1/events` — append event and revision-checked snapshot update.

POST requires `eventId`, `topicId`, `type`, `occurredAt`, `state`, and preferably `baseRevision`. A stale revision returns HTTP 409 with the current state. Reusing an event ID is idempotent; if the event was saved but the snapshot write failed, a retry can reconcile the snapshot from the event's stored state.

## Security and acceptance gates

- Secrets are encrypted Worker secrets; never commit or expose them.
- CORS allows only the configured GitHub Pages origin. CORS is not authentication; the bearer token is still required.
- Error responses do not expose raw Notion error messages.
- Notion API property compatibility and integration permissions must be verified against the live databases.
- Notion does not provide a transaction spanning event and snapshot writes. Retry reconciliation reduces partial-write risk, but simultaneous writes from multiple devices still require conflict handling and real acceptance tests.
- The frontend is not yet connected to this Worker. Do not treat the service as production-ready until the API, migration, offline behavior, and two-device tests pass.
