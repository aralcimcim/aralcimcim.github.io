"""Save this bot's credentials locally, without putting the token in shell history."""

import getpass
import json
import os
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request


BOT_USERNAME = "aral_toitoi_bot"


def telegram(token, method, payload=None):
    request = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/{method}",
        data=json.dumps(payload or {}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            result = json.load(response)
    except (urllib.error.URLError, OSError, ValueError):
        raise ValueError("Telegram could not be reached or rejected the token. Check the token and try again.") from None
    if result.get("ok") is not True:
        raise ValueError("Telegram rejected the request. Check the bot token and try again.")
    return result["result"]


def main():
    if not sys.stdin.isatty():
        raise ValueError("Run this setup in your own terminal so the token prompt stays hidden.")
    print(f"First open https://t.me/{BOT_USERNAME} and press Start.")
    token = getpass.getpass("BotFather token (hidden): ").strip()
    if not re.fullmatch(r"\d+:[A-Za-z0-9_-]{20,}", token):
        raise ValueError("That does not look like a BotFather token.")
    bot = telegram(token, "getMe")
    if bot.get("username", "").lower() != BOT_USERNAME:
        raise ValueError(f"Use the token for @{BOT_USERNAME}.")
    updates = telegram(token, "getUpdates", {"allowed_updates": ["message"], "timeout": 0})
    chats = {}
    for update in updates:
        chat = update.get("message", {}).get("chat", {})
        if chat.get("type") == "private":
            chats[str(chat["id"])] = chat
    if not chats:
        raise ValueError("No private chat found. Press Start in your bot, send it hello, and run this command again.")
    print("Private chats that have messaged this bot:")
    for chat_id, chat in chats.items():
        name = chat.get("username") or chat.get("first_name") or "Telegram user"
        name = "".join(c for c in str(name) if c.isprintable())
        print(f"  {chat_id}: {name}")
    chosen = input("Enter YOUR chat ID from the list above: ").strip()
    if chosen not in chats or not chosen.isdigit():
        raise ValueError("Choose your own private chat ID from the displayed list.")
    destination = Path(__file__).with_name(".dev.vars")
    flags = os.O_WRONLY | os.O_CREAT | os.O_TRUNC | getattr(os, "O_NOFOLLOW", 0)
    descriptor = os.open(destination, flags, 0o600)
    with os.fdopen(descriptor, "w") as saved:
        os.fchmod(saved.fileno(), 0o600)
        saved.write(f'TELEGRAM_BOT_TOKEN="{token}"\nTELEGRAM_CHAT_ID="{chosen}"\n')
    print("Saved .dev.vars with owner-only permissions. Git ignores this file.")
    print("No notification was sent. The next step is deploying the Worker.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, EOFError) as error:
        # Only our own messages are printed; never echo a Telegram request URL.
        if isinstance(error, ValueError):
            print(str(error), file=sys.stderr)
        else:
            print("Setup could not finish. Check local file permissions and retry.", file=sys.stderr)
        sys.exit(1)
