export const config = { runtime: "edge" };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ALLOWED_MODEL = "claude-sonnet-4-6";
const FREE_SAMPLE_WINDOW_DAYS = 30;

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!apiKey || !supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: { message: "Server not configured." } }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: { message: "Invalid request." } }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  const { question, tool, gated, lang } = body;
  if (!question || typeof question !== "string" || question.length > 2000) {
    return new Response(
      JSON.stringify({ error: { message: "Invalid question." } }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
  if (!["counter_guide", "ftb"].includes(tool)) {
    return new Response(
      JSON.stringify({ error: { message: "Invalid tool." } }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  const ipHash = await sha256Hex(ip + "|" + tool);

  // ── Free-sample gate (only applies when gated=true, i.e. Counter Guide's
  // pre-purchase hook -- FTB customers already paid, so they skip this check) ──
  if (gated) {
    const since = new Date(Date.now() - FREE_SAMPLE_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
    try {
      const checkResp = await fetch(
        `${supabaseUrl}/rest/v1/free_samples?ip_hash=eq.${ipHash}&tool=eq.${tool}&created_at=gte.${since}&select=id`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const existing = await checkResp.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return new Response(
          JSON.stringify({ gated_out: true, message: "Free sample already used." }),
          { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
        );
      }
    } catch {
      // If the gate check itself fails, fail closed-ish: still allow the call through
      // rather than blocking a legitimate user over an infra hiccup.
    }
  }

  const langInstruction = lang === "es"
    ? "\n\nIMPORTANT: Respond entirely in Spanish (Español), natural and conversational."
    : "";

  const prompt = `You are a former automotive finance manager and dealership insider. A car buyer is describing a specific tactic or pressure they are experiencing RIGHT NOW, in real time -- possibly while sitting at the dealership. Give them a short, direct, actionable answer: (1) name the tactic in plain English if there is one, (2) explain in 1-2 sentences why the dealer is doing this, (3) give them an exact word-for-word script to say back, right now. Keep the whole answer under 150 words -- this needs to be readable in seconds, not a full article. Do not pad with disclaimers or preamble. Get straight to the script.

Also, on a final line by itself, output a normalized tactic category tag in this exact format: TACTIC_TAG: [category] -- choose the single best-fitting category from: add_on_pressure, trade_in_lowball, payment_packing, rate_markup, hidden_fees, high_pressure_close, otd_price_dodge, warranty_upsell, other.

What's happening: "${question}"${langInstruction}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ALLOWED_MODEL,
        max_tokens: 400,
        stream: false,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: { message: data?.error?.message || "Anthropic API error" } }),
        { status: response.status, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const textBlock = data.content?.find(b => b.type === "text");
    const fullText = textBlock?.text || "";
    const tagMatch = fullText.match(/TACTIC_TAG:\s*(\w+)/i);
    const tacticTag = tagMatch ? tagMatch[1].toLowerCase() : "other";
    const answer = fullText.replace(/TACTIC_TAG:\s*\w+\s*$/i, "").trim();

    // Log usage -- write-only, fire-and-forget. Also feeds tactic tracking
    // regardless of gated/paid, since this is the whole point of the loop.
    fetch(`${supabaseUrl}/rest/v1/free_samples`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ ip_hash: ipHash, tool, tactic_tag: tacticTag, was_gated: !!gated }),
    }).catch(() => {});

    return new Response(
      JSON.stringify({ answer, tactic_tag: tacticTag }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: error.message || "Unknown error" } }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
}
