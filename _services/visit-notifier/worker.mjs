/** A homepage view becomes one private message to the operator's fixed chat. */
export async function handleRequest(request, env, telegramFetch = fetch) {
  const url = new URL(request.url);
  const configured = Boolean(env.TELEGRAM_BOT_TOKEN && /^\d+$/.test(env.TELEGRAM_CHAT_ID || ""));
  const origin = request.headers.get("Origin");
  const allowed = env.ALLOWED_ORIGIN === "https://aralcimcim.github.io" && origin === env.ALLOWED_ORIGIN;
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json",
    Vary: "Origin",
  };
  if (allowed) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }
  const reply = (status, error) => new Response(JSON.stringify({ error }), { status, headers });
  if (url.pathname === "/health" && request.method === "GET") {
    return new Response(JSON.stringify({ configured }), { status: configured ? 200 : 503, headers });
  }
  if (url.pathname !== "/visit") return reply(404, "Not found");
  if (!allowed) return reply(403, "Origin not allowed");
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return reply(405, "Use POST");
  if (!configured) return reply(503, "Notifications are not configured");
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return reply(415, "Use JSON");
  if (Number(request.headers.get("Content-Length")) > 256) return reply(413, "Event too large");
  let event;
  try {
    const body = await request.text();
    if (body.length > 256) return reply(413, "Event too large");
    event = JSON.parse(body);
  } catch {
    return reply(400, "Invalid JSON");
  }
  if (!event || event.event !== "page_view" || event.path !== "/") return reply(400, "Invalid homepage event");

  try {
    const sent = await telegramFetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: `toitoitoi 🎉\nYour homepage was visited.\nhttps://aralcimcim.github.io/\n${new Date().toISOString()}`,
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await sent.json();
    if (!sent.ok || result.ok !== true) return reply(502, "Notification delivery failed");
    return new Response(null, { status: 204, headers });
  } catch {
    // Never return or log an upstream URL/error containing the bot token.
    return reply(502, "Notification delivery failed");
  }
}

export default { fetch: (request, env) => handleRequest(request, env) };
