# Homepage → private Telegram notification

The homepage sends a small event to a Cloudflare Worker, which sends `toitoitoi 🎉` to the operator's fixed private Telegram chat through `@aral_toitoi_bot`. Telegram credentials are server-side secrets. The public site contains only the Worker's `/visit` URL.

**Connected endpoint:** `https://aral-toitoitoi.aralcimcim.workers.dev/visit`. The homepage hook is enabled through `visit_notification_url` in `_config.yml`. Clearing that setting disables the homepage signal.

## Local credential setup

Open <https://t.me/aral_toitoi_bot>, press **Start**, and send `hello`. Then, from this directory:

```bash
python3 configure.py
```

Paste the BotFather token at the hidden prompt, then select your own private chat ID. The script verifies the bot username using `getMe` and reads its recent private-chat updates using `getUpdates`. It does not send a message. The token and selected chat ID are saved to `.dev.vars` with owner-only permissions; the file is ignored by Git and excluded from Jekyll output. Do not put secrets in `_config.yml`, browser JavaScript, this README, or chat messages.
