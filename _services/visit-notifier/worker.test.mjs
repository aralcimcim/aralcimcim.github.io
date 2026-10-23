import assert from "node:assert/strict";
import test from "node:test";
import { handleRequest } from "./worker.mjs";

const env = { ALLOWED_ORIGIN: "https://aralcimcim.github.io", TELEGRAM_BOT_TOKEN: "test-only-token", TELEGRAM_CHAT_ID: "12345" };
const request = (overrides = {}) =>
  new Request("https://notifier.example/visit", {
    method: "POST",
    headers: { Origin: env.ALLOWED_ORIGIN, "Content-Type": "application/json" },
    body: JSON.stringify({ event: "page_view", path: "/" }),
    ...overrides,
  });
const noSend = () => {
  throw new Error("Must not call Telegram");
};

test("A valid homepage event sends only fixed content to the configured private chat", async () => {
  let calls = 0;
  const result = await handleRequest(
    request({ body: JSON.stringify({ event: "page_view", path: "/", chat_id: "attacker", text: "injected", ip: "untrusted" }) }),
    env,
    async (url, options) => {
      calls++;
      assert.equal(url, "https://api.telegram.org/bottest-only-token/sendMessage");
      const sent = JSON.parse(options.body);
      assert.equal(sent.chat_id, "12345");
      assert.match(sent.text, /^toitoitoi 🎉\nYour homepage was visited\./);
      assert.doesNotMatch(JSON.stringify(sent), /attacker|injected|untrusted/);
      return Response.json({ ok: true });
    }
  );
  assert.equal(result.status, 204);
  assert.equal(calls, 1);
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), env.ALLOWED_ORIGIN);
});

test("Origin checks reject off-site and missing-origin requests without sending", async () => {
  for (const origin of ["https://elsewhere.example", "null", ""]) {
    const result = await handleRequest(request({ headers: { Origin: origin, "Content-Type": "application/json" } }), env, noSend);
    assert.equal(result.status, 403);
    assert.equal(result.headers.get("Access-Control-Allow-Origin"), null);
  }
});

test("Preflight succeeds; GET and malformed/non-homepage events do not send", async () => {
  assert.equal((await handleRequest(request({ method: "OPTIONS", body: undefined }), env, noSend)).status, 204);
  assert.equal((await handleRequest(request({ method: "GET", body: undefined }), env, noSend)).status, 405);
  for (const body of [
    "not json",
    "null",
    JSON.stringify({ event: "page_view", path: "/research/" }),
    JSON.stringify({ event: "different", path: "/" }),
  ]) {
    assert.equal((await handleRequest(request({ body }), env, noSend)).status, 400);
  }
  assert.equal((await handleRequest(request({ body: "x".repeat(257) }), env, noSend)).status, 413);
});

test("Missing secrets and group chat IDs leave notifications disabled", async () => {
  for (const invalid of [{}, { ...env, TELEGRAM_CHAT_ID: "-987" }, { ...env, TELEGRAM_BOT_TOKEN: "" }]) {
    assert.equal((await handleRequest(request(), { ...invalid, ALLOWED_ORIGIN: env.ALLOWED_ORIGIN }, noSend)).status, 503);
  }
});

test("Telegram rejection, throttling, and network errors never expose the token", async () => {
  for (const send of [
    async () => Response.json({ ok: false, description: "token details" }, { status: 429 }),
    async () => Response.json({ ok: false }),
    async () => {
      throw new Error("https://api.telegram.org/bottest-only-token/sendMessage");
    },
  ]) {
    const result = await handleRequest(request(), env, send);
    assert.equal(result.status, 502);
    assert.equal(await result.text(), '{"error":"Notification delivery failed"}');
  }
});

test("Health exposes configuration readiness without credentials or a message", async () => {
  const result = await handleRequest(new Request("https://notifier.example/health"), env, noSend);
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { configured: true });
});
