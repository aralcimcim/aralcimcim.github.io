# Homepage → private Telegram notification

The homepage sends a small event to a Cloudflare Worker, which sends `toitoitoi 🎉` to the operator's fixed private Telegram chat through `@aral_toitoi_bot`. Telegram credentials are server-side secrets. The public site contains only the Worker's `/visit` URL.

**Connected endpoint:** `https://aral-toitoitoi.aralcimcim.workers.dev/visit`. The homepage hook is enabled through `visit_notification_url` in `_config.yml`. Clearing that setting disables the homepage signal.

## Local credential setup

Open <https://t.me/aral_toitoi_bot>, press **Start**, and send `hello`. Then, from this directory:

```bash
python3 configure.py
```

Paste the BotFather token at the hidden prompt, then select your own private chat ID. The script verifies the bot username using `getMe` and reads its recent private-chat updates using `getUpdates`. It does not send a message. The token and selected chat ID are saved to `.dev.vars` with owner-only permissions; the file is ignored by Git and excluded from Jekyll output. Do not put secrets in `_config.yml`, browser JavaScript, this README, or chat messages.

## Deploy

With your Cloudflare account, use the Workers free plan. Do not enable a paid plan for this small endpoint.

```bash
npx wrangler login --scopes account:read user:read workers:write workers_scripts:write workers_routes:write
npx wrangler deploy --secrets-file .dev.vars
```

The CLI prompts for authentication and prints the Worker URL. Secrets in `.dev.vars` are uploaded as Worker secrets. The public `wrangler.jsonc` contains only the allowed homepage origin. The Worker does not require a database or a custom domain.

Check the Worker's `/health` URL; a configured endpoint returns HTTP 200 with `{"configured":true}`. Set the site's `visit_notification_url` to `https://<your-worker-host>/visit` in `_config.yml`, then push the site. That enables the homepage script. The entire `_services/` directory is excluded from the published site.

The first real homepage load after activation should send a message. To disable notifications, clear `visit_notification_url` and publish again, or remove the Worker secrets.

## What counts

- One notification attempt per homepage document load, including your own visits and refreshes.
- Returning to the homepage from the browser's back/forward cache counts again.
- It is a page-view notifier, not a unique-visitor counter; there is no cookie, local storage, fingerprint, or visitor database.
- The browser sends only `{"event":"page_view","path":"/"}` with credentials omitted and no referrer. The notification includes the fixed homepage link and server UTC time. The code does not attach IPs, browser details, URL queries, or referrers to Telegram messages. Hosting providers still process network requests under their own policies.
- Blocked JavaScript, closed connections, hosting limits, or Telegram failures can prevent delivery. There is no durable queue or guaranteed exactly-once delivery, and no automatic retry that could multiply messages.
- The endpoint accepts only the configured browser origin and fixed event. Origin checks restrict other browsers; an external HTTP client can spoof an Origin header. This is not a tamper-proof analytics system. Use hosting-level protection if the endpoint is abused.

## Verification

```bash
node --test worker.test.mjs
```

Tests mock Telegram; they do not contact the bot or send a real message. They cover fixed private-chat routing, rejecting other origins and malformed events, preflight handling, missing secrets, group-chat rejection, and sanitized delivery failures.

## Primary documentation

- [Telegram bot creation and tokens](https://core.telegram.org/bots/tutorial#obtain-your-bot-token)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Cloudflare Worker secrets and deployment](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
