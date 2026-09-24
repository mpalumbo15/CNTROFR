export const config = { runtime: "edge" };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const PLAN_UNLOCKS = {
  firsttime: ["deal", "ftb"],
  single:    ["deal"],
  pro:       ["deal", "fee", "review", "fi", "addons", "guide"],
  guide:     ["guide"],
  // Beta tester codes -- same full unlock as Pro Bundle, but capped at a handful of
  // redemptions (below) instead of unlimited, since these are being handed out for free
  // and aren't tied to a real purchase.
  protest:   ["deal", "fee", "review", "fi", "addons", "guide"],
};

// Redemption cap for beta tester codes specifically -- generous enough to cover the same
// person re-entering their code across multiple visits/devices (access isn't persisted
// client-side, so every return visit requires re-entering it), but bounded so a leaked
// code doesn't circulate indefinitely.
const TESTER_REDEMPTION_CAP = 5;

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: "Database not configured." }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  try {
    const { code } = await req.json();
    if (!code) {
      return new Response(JSON.stringify({ error: "No code provided." }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Look up code in Supabase
    const res = await fetch(
      `${supabaseUrl}/rest/v1/access_codes?code=eq.${encodeURIComponent(code.trim().toUpperCase())}&limit=1`,
      {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
        },
      }
    );

    const rows = await res.json();

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "Code not found." }), {
        status: 404, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const row = rows[0];
    const planId = row.plan_id;
    const isTester = planId === "protest";

    // Check if already used (single use codes)
    if (row.used) {
      return new Response(JSON.stringify({ error: "This code has already been used." }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Check expiry
    if (row.expiry && new Date(row.expiry) < new Date()) {
      return new Response(JSON.stringify({ error: "This code has expired." }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Check tester redemption cap
    if (isTester && (row.redeem_count || 0) >= TESTER_REDEMPTION_CAP) {
      return new Response(JSON.stringify({ error: "This code has reached its redemption limit." }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const unlocks = PLAN_UNLOCKS[planId] || ["deal"];
    const isSingleUse = planId === "single" || planId === "guide";

    // Mark single-use codes as used
    if (isSingleUse) {
      await fetch(
        `${supabaseUrl}/rest/v1/access_codes?code=eq.${encodeURIComponent(code.trim().toUpperCase())}`,
        {
          method: "PATCH",
          headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({ used: true }),
        }
      );
    }

    // Increment redemption count for tester codes
    if (isTester) {
      await fetch(
        `${supabaseUrl}/rest/v1/access_codes?code=eq.${encodeURIComponent(code.trim().toUpperCase())}`,
        {
          method: "PATCH",
          headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify({ redeem_count: (row.redeem_count || 0) + 1 }),
        }
      );
    }

    return new Response(JSON.stringify({ success: true, planId, unlocks }), {
      status: 200, headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
