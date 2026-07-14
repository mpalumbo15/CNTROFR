// Node.js runtime (not Edge -- Edge Functions are deprecated on Vercel).
// Classic Vercel Node.js handler signature: (req, res), not Fetch API
// Request/Response. See claude.js and digest.js for the same pattern.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ALLOWED_MODEL = "claude-sonnet-4-6";
const MAX_BODY_BYTES = 10_000_000; // 10MB for image/document uploads

function sendJson(res, status, obj) {
  res.writeHead(status, { ...CORS, "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return sendJson(res, 500, { error: { message: "API key not configured." } });
  }

  // Pre-check size via Content-Length before touching the (already-parsed) body,
  // same intent as the old byte-length check.
  const contentLength = parseInt(req.headers["content-length"] || "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return sendJson(res, 413, { error: { message: "File too large. Please use a PDF export or smaller image." } });
  }

  let body = req.body;
  try {
    if (typeof body === "string") body = JSON.parse(body);
    if (!body || typeof body !== "object") throw new Error("empty body");
  } catch {
    return sendJson(res, 400, { error: { message: "Invalid request." } });
  }

  // Force correct model, no streaming for JSON extraction
  body.model = ALLOWED_MODEL;
  body.stream = false;

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

    const data = await response.json();

    if (!response.ok) {
      return sendJson(res, response.status, { error: { message: data?.error?.message || "Anthropic API error" } });
    }

    return sendJson(res, 200, data);
  } catch (error) {
    return sendJson(res, 500, { error: { message: error.message || "Unknown error" } });
  }
}
