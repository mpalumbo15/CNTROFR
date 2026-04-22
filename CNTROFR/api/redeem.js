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
};

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

    const planId = row.plan_id;
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

    return new Response(JSON.stringify({ success: true, planId, unlocks }), {
      status: 200, headers: { ...CORS, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
