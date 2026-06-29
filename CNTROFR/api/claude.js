export const config = { runtime: "edge" };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── Concurrency limiter ──────────────────────────────────────────────────────
// Caps simultaneous Anthropic calls within this edge instance.
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

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  // ── API key check ────────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: { message: "API key not configured." } }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // ── Per-IP rate limit ────────────────────────────────────────────────────
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (!checkIpLimit(ip)) {
    return new Response(
      JSON.stringify({ error: { message: "Too many requests. Please wait a moment and try again." } }),
      { status: 429, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // ── Payload size guard ───────────────────────────────────────────────────
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  // Peek at the raw body to detect image/document scanner requests
  const rawText = await req.text();
  const isImageRequest = rawText.includes('"type":"image"') || rawText.includes('"type":"document"');
  const maxBytes = isImageRequest ? MAX_BODY_BYTES_IMAGE : MAX_BODY_BYTES_TEXT;
  if (contentLength > maxBytes) {
    return new Response(
      JSON.stringify({ error: { message: "Request too large." } }),
      { status: 413, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // ── Concurrency check ────────────────────────────────────────────────────
  if (activeRequests >= MAX_CONCURRENT) {
    return new Response(
      JSON.stringify({ error: { message: "Server is busy. Please try again in a few seconds." } }),
      { status: 503, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = JSON.parse(rawText);
  } catch {
    return new Response(
      JSON.stringify({ error: { message: "Invalid request body." } }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  // ── Model whitelist enforcement ──────────────────────────────────────────
  if (body.model && body.model !== ALLOWED_MODEL) {
    return new Response(
      JSON.stringify({ error: { message: "Model not permitted." } }),
      { status: 403, headers: { ...CORS, "Content-Type": "application/json" } }
    );
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

    return new Response(response.body, {
      status: response.status,
      headers: {
        ...CORS,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: error.message || "Unknown error" } }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } finally {
    activeRequests--;
  }
}
