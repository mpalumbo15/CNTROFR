export const config = { runtime: "edge" };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ALLOWED_MODEL = "claude-sonnet-4-6";
const MAX_BODY_BYTES = 10_000_000; // 10MB for image/document uploads

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: { message: "API key not configured." } }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    const buffer = await req.arrayBuffer();
    if (buffer.byteLength > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ error: { message: "File too large. Please use a PDF export or smaller image." } }),
        { status: 413, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }
    const text = new TextDecoder().decode(buffer);
    body = JSON.parse(text);
  } catch {
    return new Response(
      JSON.stringify({ error: { message: "Invalid request." } }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
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
      return new Response(
        JSON.stringify({ error: { message: data?.error?.message || "Anthropic API error" } }),
        { status: response.status, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: error.message || "Unknown error" } }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
}
