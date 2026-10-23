# Homepage → private Telegram notification

The homepage sends a small event to a Cloudflare Worker, which sends `toitoitoi 🎉` to the operator's fixed private Telegram chat through `@aral_toitoi_bot`. Telegram credentials are server-side secrets. The public site contains only the Worker's `/visit` URL.

**Connected endpoint:** `https://aral-toitoitoi.aralcimcim.workers.dev/visit`. The homepage hook is enabled through `visit_notification_url` in `_config.yml`. Clearing that setting disables the homepage signal.
