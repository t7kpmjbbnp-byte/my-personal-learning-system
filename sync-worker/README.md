# SÁCH TRỜI Sync Worker (setup scaffold)

This Worker is a private API adapter between the static SÁCH TRỜI app and the two Notion progress databases. Notion remains the progress store. No secrets are committed.

## Before deployment

1. Create a Notion integration and grant it access to BOTH databases:
   - Topic state data source: `4265a63d-7bde-81e5-b46c-000bd7c29125`
   - Event log data source: `4265a63d-7bde-81aa-932a-000bc27e497e`
2. Copy the integration secret privately. Never paste it into GitHub, chat, or the frontend.
3. Create a long random app access token and keep it private. Use the same value only in the Worker secret and in the app's private local configuration.
4. Install Node.js, then run from this folder:
   ```sh
   npm create cloudflare@latest -- --existing-script ./src/index.js
   npx wrangler secret put NOTION_TOKEN
   npx wrangler secret put APP_ACCESS_TOKEN
   npx wrangler deploy
   ```
   If the project is not initialized by the command, install Wrangler with `npm install -D wrangler` and run `npx wrangler deploy`.
5. Verify `GET https://YOUR-WORKER.workers.dev/health` returns `{"ok":true,...}`.
6. Keep the Worker URL and app token out of public source. The frontend integration is a separate gated step.

## API

- `GET /health` — public liveness only.
- `GET /v1/state?topicId=...` — authenticated topic snapshot.
- `GET /v1/events?topicId=...` — authenticated event history.
- `POST /v1/events` — authenticated append event + revision-checked snapshot update.

Send `Authorization: Bearer <APP_ACCESS_TOKEN>`. POST body requires `eventId`, `topicId`, `type`, `occurredAt`, `state`, and `baseRevision`. A stale revision returns HTTP 409 and current state.

## Security and current limitations

- Secrets are Worker secrets, never plaintext `vars` or frontend code.
- CORS is restricted to the GitHub Pages origin configured in `APP_ORIGIN`; CORS is not authentication, so the bearer token is still required.
- This scaffold is not yet deployed or connected to the app.
- Notion API property compatibility and integration permissions must be verified against the live databases before production use.
- Event and snapshot writes are sequential, not transactional. If snapshot update fails after event creation, retry is idempotent for the event ID but a reconciliation pass is needed to repair the snapshot.
- Event query pagination is currently limited to the first 100 rows; add cursor pagination before large-scale production use.
- Do not use this API until the setup and two-device acceptance tests pass.
