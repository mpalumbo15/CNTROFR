export const config = { runtime: "edge" };

const DIGEST_PROMPT = `You are a market intelligence analyst for CNTROFR, a car-buyer advocacy platform. Generate this week's intelligence digest for the CNTROFR team (Mike, founder -- former automotive sales and F&I, now building tools to help buyers counter dealer tactics).

Use web search to find CURRENT, THIS-WEEK information. Cover:

## DEALER TACTICS & TRENDS
What new or trending dealer sales/F&I tactics are buyers reporting this week? Any new manipulation techniques, junk fees, or add-on pushes gaining traction?

## REGULATORY & ENFORCEMENT
Any new FTC, CFPB, or state-level enforcement actions, lawsuits, or rule changes affecting auto dealers or lenders this week?

## MANUFACTURER INCENTIVES
What current OEM incentives, rebates, or 0% APR offers are active right now? Note any expiring soon.

## MARKET CONDITIONS
Any notable shifts in used car prices, inventory levels, interest rates, or doc fee trends by region?

## ACTIONABLE TAKEAWAY
One specific thing CNTROFR's prompts or messaging could incorporate this week based on the above.

Format as clean markdown with the headers above. Be specific -- cite numbers, dates, and sources where possible. Keep each section to 2-4 sentences. This is an internal briefing, not consumer-facing copy.`;

async function getDigest() {
  const body = {
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: DIGEST_PROMPT }],
    tools: [{ type: "web_search_20250305", name: "web_search" }],
  };

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  const data = await r.json();
  const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
  return textBlocks.join("\n\n") || "No digest content returned.";
}

async function getToolRunStats() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const since = new Date(Date.now() - 7 * 86400000).toISOString();
    const r = await fetch(`${url}/rest/v1/tool_runs?select=tool,timestamp&timestamp=gte.${since}`, {
      headers: { "apikey": key, "Authorization": `Bearer ${key}` },
    });
    const rows = await r.json();
    if (!Array.isArray(rows)) return null;
    const byTool = {};
    for (const row of rows) byTool[row.tool] = (byTool[row.tool] || 0) + 1;
    return { total: rows.length, byTool };
  } catch(e) { return null; }
}

function statsToMarkdown(stats) {
  if (!stats) return "_Supabase stats unavailable this week._";
  if (!stats.total) return "No tool runs in the last 7 days.";
  const lines = Object.entries(stats.byTool)
    .sort((a, b) => b[1] - a[1])
    .map(([tool, count]) => `- **${tool}**: ${count}`);
  return `**Total runs (7 days): ${stats.total}**\n\n${lines.join("\n")}`;
}

function markdownToHtml(md) {
  // Minimal markdown -> HTML for email body
  let html = md
    .replace(/^## (.*$)/gim, '<h2 style="font-size:16px;font-weight:900;color:#FFD600;margin:24px 0 8px;font-family:Arial,sans-serif;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size:20px;font-weight:900;color:#EEEAF8;margin:0 0 12px;font-family:Arial,sans-serif;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#EEEAF8;">$1</strong>')
    .replace(/^- (.*$)/gim, '<div style="margin:4px 0 4px 16px;">• $1</div>')
    .replace(/\n\n/g, '</p><p style="font-size:13px;color:#A8A4C8;line-height:1.8;font-family:Arial,sans-serif;margin:8px 0;">')
    .replace(/\n/g, '<br/>');
  return `<p style="font-size:13px;color:#A8A4C8;line-height:1.8;font-family:Arial,sans-serif;margin:8px 0;">${html}</p>`;
}

async function sendDigestEmail(digestMd, statsMd) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>CNTROFR Weekly Intelligence Digest</title></head>
<body style="margin:0;padding:0;background:#0A0A10;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A10;padding:40px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <tr><td style="padding-bottom:24px;text-align:center;">
        <img src="https://cntrofr.com/cntrofrplateplus.png" alt="CNTROFR" width="240" style="display:block;margin:0 auto;height:auto;" />
        <div style="margin-top:12px;font-size:10px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#606080;">Weekly Intelligence Digest</div>
        <div style="margin-top:4px;font-size:11px;color:#606080;font-weight:700;">${today}</div>
      </td></tr>

      <tr><td style="background:#16161E;border:2px solid #28283A;border-radius:16px;padding:28px 24px;">
        <div style="font-size:10px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#FFD600;margin-bottom:16px;">Platform Activity -- Last 7 Days</div>
        <div style="font-size:13px;color:#A8A4C8;line-height:1.8;margin-bottom:24px;">${statsMd.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<strong style='color:#EEEAF8;'>$1</strong>")}</div>

        <div style="border-top:1px solid #28283A;padding-top:20px;">
          <div style="font-size:10px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#FFD600;margin-bottom:8px;">Market Intelligence</div>
          ${markdownToHtml(digestMd)}
        </div>
      </td></tr>

      <tr><td style="padding-top:20px;text-align:center;">
        <div style="font-size:11px;color:#606080;font-weight:700;">CNTROFR LLC -- Automated Monday Digest</div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = `CNTROFR Weekly Intelligence Digest -- ${today}\n\nPlatform Activity (7 days):\n${statsMd}\n\nMarket Intelligence:\n${digestMd}`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "CNTROFR <onboarding@resend.dev>",
      to: ["info@cntrofr.com"],
      subject: `CNTROFR Weekly Digest -- ${today}`,
      html,
      text,
    }),
  });
}

export default async function handler(req) {
  // Optional: protect with a secret so randoms can't trigger it
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [digest, stats] = await Promise.all([getDigest(), getToolRunStats()]);
    const statsMd = statsToMarkdown(stats);
    await sendDigestEmail(digest, statsMd);
    return new Response("OK", { status: 200 });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
