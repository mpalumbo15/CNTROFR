// Node.js runtime (not Edge -- Edge Functions are deprecated on Vercel).
// Classic Vercel Node.js handler signature: (req, res). The one real
// wrinkle vs. scan.js/tactic-answer.js: this streams the Anthropic response
// through to the client, and fetch()'s response.body is a Web ReadableStream,
// not a Node stream -- Readable.fromWeb() bridges the two.

import { Readable } from "node:stream";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── Concurrency limiter ──────────────────────────────────────────────────────
// Caps simultaneous Anthropic calls within this instance.
// Protects against rate limit hammering at Tier 2 and keeps costs predictable.
const MAX_CONCURRENT = 3;
let activeRequests = 0;

// ── Per-IP rate limiter ──────────────────────────────────────────────────────
// Max 10 requests per IP per 60-second window.
const IP_LIMIT = 10;
const IP_WINDOW_MS = 60_000;
const ipMap = new Map(); // { ip -> { count, windowStart } }

function checkIpLimit(ip) {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now - entry.windowStart > IP_WINDOW_MS) {
    ipMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= IP_LIMIT) return false;
  entry.count++;
  return true;
}

// ── Model whitelist ──────────────────────────────────────────────────────────
// Only allow the approved model. Blocks prompt injection attempts that try
// to escalate to Opus or other models.
const ALLOWED_MODEL = "claude-sonnet-4-6";

// ── Max payload size ─────────────────────────────────────────────────────────
// Standard text requests: 32KB
// Image/document scanner requests: 10MB (base64 images are large)
const MAX_BODY_BYTES_TEXT = 32_000;
const MAX_BODY_BYTES_IMAGE = 10_000_000;

function sendJson(res, status, obj) {
  res.writeHead(status, { ...CORS, "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }

  // ── API key check ────────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return sendJson(res, 500, { error: { message: "API key not configured." } });
  }

  // ── Per-IP rate limit ────────────────────────────────────────────────────
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.headers["cf-connecting-ip"] ||
    "unknown";

  if (!checkIpLimit(ip)) {
    return sendJson(res, 429, { error: { message: "Too many requests. Please wait a moment and try again." } });
  }

  // ── Payload size guard + body parse ─────────────────────────────────────
  let body = req.body;
  try {
    if (typeof body === "string") body = JSON.parse(body);
    if (!body || typeof body !== "object") throw new Error("empty body");
    const bodyStr = JSON.stringify(body);
    const isImageRequest = bodyStr.includes('"type":"image"') || bodyStr.includes('"type":"document"');
    const maxBytes = isImageRequest ? MAX_BODY_BYTES_IMAGE : MAX_BODY_BYTES_TEXT;
    const contentLength = parseInt(req.headers["content-length"] || String(bodyStr.length), 10);
    if (contentLength > maxBytes) {
      return sendJson(res, 413, { error: { message: "Request too large." } });
    }
  } catch {
    return sendJson(res, 400, { error: { message: "Invalid request body." } });
  }

  // ── Concurrency check ────────────────────────────────────────────────────
  if (activeRequests >= MAX_CONCURRENT) {
    return sendJson(res, 503, { error: { message: "Server is busy. Please try again in a few seconds." } });
  }

  // ── Model whitelist enforcement ──────────────────────────────────────────
  if (body.model && body.model !== ALLOWED_MODEL) {
    return sendJson(res, 403, { error: { message: "Model not permitted." } });
  }
  body.model = ALLOWED_MODEL;
  body.stream = true;

  // ── Fire the Anthropic request ───────────────────────────────────────────
  activeRequests++;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    res.writeHead(response.status, {
      ...CORS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });

    if (!response.body) {
      return res.end();
    }

    const nodeStream = Readable.fromWeb(response.body);
    nodeStream.on("error", () => res.end());
    nodeStream.pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      return sendJson(res, 500, { error: { message: error.message || "Unknown error" } });
    }
    res.end();
  } finally {
    activeRequests--;
  }
}
