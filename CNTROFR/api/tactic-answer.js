// Node.js runtime (not Edge -- Edge Functions are deprecated on Vercel).
// Classic Vercel Node.js handler signature: (req, res). crypto.subtle is a
// Node.js global (Web Crypto API) so the hashing logic is unchanged.

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
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!apiKey || !supabaseUrl || !supabaseKey) {
    return sendJson(res, 500, { error: { message: "Server not configured." } });
  }

  let body = req.body;
  try {
    if (typeof body === "string") body = JSON.parse(body);
    if (!body || typeof body !== "object") throw new Error("empty body");
  } catch {
    return sendJson(res, 400, { error: { message: "Invalid request." } });
  }

  const { question, tool, gated, lang, dealerGroup } = body;
  if (!question || typeof question !== "string" || question.length > 2000) {
    return sendJson(res, 400, { error: { message: "Invalid question." } });
  }
  if (!["counter_guide", "ftb"].includes(tool)) {
    return sendJson(res, 400, { error: { message: "Invalid tool." } });
  }

  // Whitelist -- only known, publicly-traded dealer groups. Never accept a
  // free-text dealer name here: naming a specific, individually identifiable
  // local business carries real defamation exposure that a well-documented
  // public company does not. See ARCHITECTURE.md note on this decision.
  const KNOWN_GROUPS = ["asbury", "lithia", "autonation", "holman", "penske", "sonic", "group1", "independent"];
  const safeGroup = KNOWN_GROUPS.includes(String(dealerGroup || "").toLowerCase()) ? String(dealerGroup).toLowerCase() : null;

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.headers["cf-connecting-ip"] ||
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
        return sendJson(res, 200, { gated_out: true, message: "Free sample already used." });
      }
    } catch {
      // If the gate check itself fails, fail closed-ish: still allow the call through
      // rather than blocking a legitimate user over an infra hiccup.
    }
  }

  const langInstruction = lang === "es"
    ? "\n\nIMPORTANT: Respond entirely in Spanish (Español), natural and conversational."
    : "";

  const framing = tool === "ftb"
    ? `You are a former automotive finance manager and dealership insider, talking to a first-time car buyer. They may be asking a general question, describing something confusing, or describing active pressure from a salesperson or finance manager -- it could be before, during, or after a dealership visit. Give them a short, warm, direct answer: (1) answer their actual question in plain English, explaining any industry term the moment you use it, (2) if it involves a dealer tactic, name it and explain briefly why dealers do it, (3) if there's something they should say or do, give them the exact words or next step. Keep the whole answer under 150 words. No question is too basic -- never make them feel silly for asking. Do not pad with disclaimers or preamble.`
    : `You are a former automotive finance manager and dealership insider. A car buyer is describing a specific tactic or pressure they are experiencing RIGHT NOW, in real time -- possibly while sitting at the dealership. Give them a short, direct, actionable answer: (1) name the tactic in plain English if there is one, (2) explain in 1-2 sentences why the dealer is doing this, (3) give them an exact word-for-word script to say back, right now. Keep the whole answer under 150 words -- this needs to be readable in seconds, not a full article. Do not pad with disclaimers or preamble. Get straight to the script.`;

  const GROUP_NAMES = { asbury: "Asbury Automotive", lithia: "Lithia Motors", autonation: "AutoNation", holman: "Holman", penske: "Penske Automotive", sonic: "Sonic Automotive", group1: "Group 1 Automotive" };

  const groupContext = safeGroup && safeGroup !== "independent"
    ? `\n\nThe buyer identified this as a ${GROUP_NAMES[safeGroup]}-owned store. Public Pulse context (state this as general reported pattern, never as a specific accusation against this exact location): large, publicly-traded dealer groups like this typically run centralized, standardized sales and F&I training across every store they own -- meaning what the buyer is experiencing is more likely a company-wide playbook than one manager's personal approach. Frame it that way if relevant: "this tends to be how ${GROUP_NAMES[safeGroup]}-trained stores are taught to run this," not "this specific store is doing something wrong." Never state anything as a confirmed fact about this individual location -- only about how large corporate groups generally train and operate.`
    : safeGroup === "independent"
    ? `\n\nThe buyer identified this as an independent, non-corporate dealership. Note if relevant: independent stores don't have the same centralized corporate training structure, so tactics vary more by individual owner or manager rather than a standardized company-wide playbook.`
    : "";

  const prompt = `${framing}

Relevant fact if it applies: the FTC has alleged (in a contested complaint against a major dealer group, not yet finally resolved) that some dealerships have buyers sign on electronic tablets showing only the signature line, not the full document -- making it easy to miss add-ons never agreed to. If the buyer mentions signing on a tablet or device, tell them to ask the F&I manager to scroll through the full document on screen (not just the signature boxes) or request a printed copy -- a normal, reasonable ask.${groupContext}

Also, on a final line by itself, output a normalized tactic category tag in this exact format: TACTIC_TAG: [category] -- choose the single best-fitting category from: add_on_pressure, trade_in_lowball, payment_packing, rate_markup, hidden_fees, high_pressure_close, otd_price_dodge, warranty_upsell, digital_signing_concern, general_question, other.

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
      return sendJson(res, response.status, { error: { message: data?.error?.message || "Anthropic API error" } });
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

    return sendJson(res, 200, { answer, tactic_tag: tacticTag });
  } catch (error) {
    return sendJson(res, 500, { error: { message: error.message || "Unknown error" } });
  }
}
