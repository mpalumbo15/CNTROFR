// Node.js runtime (not Edge) -- this cron does two parallel web-search AI
// calls plus Supabase writes, which routinely exceeds Edge Runtime's hard
// 25-second response-start limit. Node.js runtime respects the maxDuration
// (60s) configured for this file in vercel.json; Edge Runtime does not.

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
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [{ role: "user", content: DIGEST_PROMPT }],
    tools: [{ type: "web_search_20250305", name: "web_search" }],
  };

  try {
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
    if (!r.ok || data.error) {
      console.error("getDigest: Anthropic API error", r.status, data.error);
      return "_Market intelligence unavailable this week (API error)._";
    }
    const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
    return textBlocks.join("\n\n") || "No digest content returned.";
  } catch (e) {
    console.error("getDigest threw:", e.message);
    return "_Market intelligence unavailable this week (request failed)._";
  }
}

// ── News ticker candidates ────────────────────────────────────────────────
// Finds recent, independently-sourced headlines relevant to car buyers, with
// verified publish dates -- proposed as "pending" for Mike to review and
// approve directly in Supabase before they ever show up on the public ticker.
// Deliberately strict on dates: better to return fewer items than to include
// anything with an unverifiable or stale publish date.
async function getTickerCandidates() {
  const prompt = `You are finding current, credible news for a car-buyer advocacy platform's public news ticker.

Find 5-8 recent news items relevant to car buyers: FTC/CFPB enforcement actions against dealers or lenders, dealer tactic exposes, notable shifts in used/new car prices or inventory, manufacturer incentive news, or consumer-protection wins.

CRITICAL RULES ON SOURCING AND DATES:
- Only include independent journalism, consumer advocacy organizations, or official government sources (FTC.gov, CFPB.gov, etc). Do NOT include dealer-funded, manufacturer-funded, or trade-association sources.
- Only include an item if you can confidently verify its actual publish date from the search result, AND that date is within the last 21 days.
- If you cannot verify a real publish date, or it's older than 21 days, leave it out entirely. Returning 3 solid items is better than 8 with shaky dates.

Return ONLY a JSON array, no markdown, no preamble, no explanation:
[{ "headline": "...", "source": "Publication Name", "url": "https://...", "published_date": "YYYY-MM-DD" }]`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });
    const data = await r.json();
    if (!r.ok || data.error) {
      console.error("getTickerCandidates: Anthropic API error", r.status, data.error);
      return [];
    }
    const textBlocks = (data.content || []).filter(b => b.type === "text").map(b => b.text);
    const combined = textBlocks.join("\n");
    const jsonMatch = combined.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("getTickerCandidates: no JSON array found in response:", combined.slice(0, 500));
      return [];
    }
    let items;
    try {
      items = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("getTickerCandidates: JSON parse failed:", parseErr.message, jsonMatch[0].slice(0, 500));
      return [];
    }
    if (!Array.isArray(items)) {
      console.error("getTickerCandidates: parsed result is not an array:", items);
      return [];
    }
    const filtered = items.filter(it => it.headline && it.source && it.published_date);
    console.log(`getTickerCandidates: found ${items.length} raw, ${filtered.length} valid after filtering`);
    return filtered;
  } catch (e) {
    console.error("getTickerCandidates threw:", e.message);
    return [];
  }
}

async function saveTickerCandidates(items) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || !items.length) return 0;
  try {
    const rows = items.map(it => ({
      headline: it.headline,
      source: it.source,
      url: it.url || null,
      published_date: it.published_date,
      status: "pending",
    }));
    const resp = await fetch(`${url}/rest/v1/news_ticker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(rows),
    });
    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      console.error("news_ticker insert failed:", resp.status, errBody);
      return 0;
    }
    return rows.length;
  } catch (e) {
    console.error("news_ticker insert threw:", e.message);
    return 0;
  }
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

// ── Tactic tracking stats (from the "What's Happening Right Now?" answer block) ──
// Same shape/pattern as getToolRunStats -- pulls the last 7 days of free_samples
// rows and breaks them down by tactic_tag, so the digest shows what dealer
// tactics people are actually typing in about, live, not just tool usage counts.
async function getTacticStats() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const since = new Date(Date.now() - 7 * 86400000).toISOString();
    const r = await fetch(`${url}/rest/v1/free_samples?select=tool,tactic_tag,was_gated,created_at&created_at=gte.${since}`, {
      headers: { "apikey": key, "Authorization": `Bearer ${key}` },
    });
    const rows = await r.json();
    if (!Array.isArray(rows)) return null;
    const byTag = {};
    let gatedCount = 0;
    for (const row of rows) {
      const tag = row.tactic_tag || "other";
      byTag[tag] = (byTag[tag] || 0) + 1;
      if (row.was_gated) gatedCount++;
    }
    return { total: rows.length, byTag, gatedCount };
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

function tacticStatsToMarkdown(stats) {
  if (!stats) return "_Tactic tracking unavailable this week._";
  if (!stats.total) return "No tactic questions asked in the last 7 days.";
  const lines = Object.entries(stats.byTag)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => `- **${tag.replace(/_/g, " ")}**: ${count}`);
  return `**Total questions (7 days): ${stats.total}** (${stats.gatedCount} from free-sample, non-paying visitors)\n\n${lines.join("\n")}`;
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

async function sendDigestEmail(digestMd, statsMd, tacticMd, tickerCount = 0) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const tickerReminderHtml = tickerCount > 0
    ? `<div style="background:rgba(255,214,0,.08);border:1px solid rgba(255,214,0,.3);border-radius:10px;padding:14px 16px;margin-bottom:24px;">
         <div style="font-size:12px;font-weight:900;color:#FFD600;margin-bottom:4px;">📰 ${tickerCount} new ticker headline${tickerCount === 1 ? "" : "s"} awaiting review</div>
         <div style="font-size:12px;color:#A8A4C8;font-weight:700;">Sitting as "pending" in the news_ticker table in Supabase. Nothing goes live on the site until you flip them to "approved."</div>
       </div>`
    : "";

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
        ${tickerReminderHtml}
        <div style="font-size:10px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#FFD600;margin-bottom:16px;">Platform Activity -- Last 7 Days</div>
        <div style="font-size:13px;color:#A8A4C8;line-height:1.8;margin-bottom:24px;">${statsMd.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<strong style='color:#EEEAF8;'>$1</strong>")}</div>

        <div style="border-top:1px solid #28283A;padding-top:20px;margin-bottom:24px;">
          <div style="font-size:10px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:#FFD600;margin-bottom:16px;">Top Tactics This Week</div>
          <div style="font-size:13px;color:#A8A4C8;line-height:1.8;">${tacticMd.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<strong style='color:#EEEAF8;'>$1</strong>")}</div>
        </div>

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

  const text = `CNTROFR Weekly Intelligence Digest -- ${today}\n\n${tickerCount > 0 ? `${tickerCount} new ticker headline(s) awaiting review in Supabase (news_ticker table, status=pending).\n\n` : ""}Platform Activity (7 days):\n${statsMd}\n\nTop Tactics This Week:\n${tacticMd}\n\nMarket Intelligence:\n${digestMd}`;

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
    const results = await Promise.allSettled([getDigest(), getToolRunStats(), getTacticStats(), getTickerCandidates()]);
    const [digestR, statsR, tacticR, tickerR] = results;

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const names = ["getDigest", "getToolRunStats", "getTacticStats", "getTickerCandidates"];
        console.error(`${names[i]} rejected:`, r.reason);
      }
    });

    const digest = digestR.status === "fulfilled" ? digestR.value : "_Market intelligence unavailable this week._";
    const stats = statsR.status === "fulfilled" ? statsR.value : null;
    const tacticStats = tacticR.status === "fulfilled" ? tacticR.value : null;
    const tickerCandidates = tickerR.status === "fulfilled" ? tickerR.value : [];

    const statsMd = statsToMarkdown(stats);
    const tacticMd = tacticStatsToMarkdown(tacticStats);
    const savedCount = await saveTickerCandidates(tickerCandidates);

    try {
      await sendDigestEmail(digest, statsMd, tacticMd, savedCount);
    } catch (emailErr) {
      console.error("sendDigestEmail threw:", emailErr.message);
      return new Response(`Email send failed: ${emailErr.message}`, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("digest handler threw:", e.message);
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
}
