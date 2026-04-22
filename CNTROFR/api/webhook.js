export const config = { runtime: "edge" };

const PLAN_CONFIG = {
  firsttime: {
    name: "First Time Buyer Package",
    unlocks: ["deal", "ftb"],
    expiry: 30,
    singleUse: false,
    emailIntro: `Your First Time Buyer Package is active. Before you run your deal, read through the prep guide below — it covers what dealers assume you already know, and what most buyers find out the hard way.`,
    prepSteps: `
BEFORE YOU WALK IN — YOUR 5-POINT PREP:

1. HAVE A PLAN
   Know what type of vehicle you need before you go (SUV, sedan, truck). If you're starting from scratch with no idea, you'll be overwhelmed before you sit down. Narrow it down first.

2. COLOR FLEXIBILITY SAVES MONEY
   Think light versus dark — not a specific color combination. The more flexible you are, the more inventory options you have, and flexibility is leverage. Don't build an imaginary wall for yourself.

3. BE HONEST WITH YOURSELF ABOUT YOUR FINANCES
   You know your income, your bills, and your credit history. If you're missing the basics, talk to a parent or trusted person first. A qualified co-signer will almost always get you a better interest rate than a first-time buyer program — and it keeps your household informed.

4. BUDGET FOR THE COSTS DEALERS DON'T MENTION
   Insurance, registration, license plates, and personal property taxes are all real costs that hit after the deal is done. Dealers assume you know this. Most first-time buyers don't. Factor them into your budget before you negotiate a price.

5. KNOW YOUR OUT-THE-DOOR NUMBER
   Negotiate the total price — not the monthly payment. Everything else follows from there.`,
    emailNote: `Your access is valid for 30 days from purchase. Single use — enter your code once to unlock.`,
  },
  single: {
    name: "Single Report",
    unlocks: ["deal"],
    expiry: null,
    singleUse: true,
    emailIntro: `Your Single Report access is ready. Enter your code to run a full Deal Analyzer — price breakdown, trade-in analysis, add-on flags, and your counter strategy.`,
    prepSteps: null,
    emailNote: `Single use, no expiry. Use it when you're ready.`,
  },
  pro: {
    name: "Pro Bundle",
    unlocks: ["deal", "fee", "review", "fi", "addons", "guide"],
    expiry: 7,
    singleUse: false,
    emailIntro: `Your Pro Bundle is active. All 5 tools are unlocked. Here's the order we recommend running them for maximum leverage:`,
    prepSteps: `
YOUR PRO BUNDLE — USE THE TOOLS IN THIS ORDER:

1. REVIEW PURITY (before you commit to anything)
   Know who you're buying from. Customer reviews, employee culture, and complaint records — so your money goes to dealers who deserve it.

2. FEE COMPARISON (dealer fees have to be publicly posted)
   Find out if your dealer's fees are fair before you sit down. Dealer fees must appear on their website or any marketing — use that against them.

3. ADD-ON FIGHTER (use this after you walk in)
   Once you're at the dealership and see what they've pre-installed on the vehicle, run this. Dealers don't have to publish pre-installed add-ons online — so you won't know until you're there.

4. DEAL ANALYZER (when you have numbers in front of you)
   Once you have the vehicle price, interest rate, taxes, and fees — run your deal and get your counter.

5. F&I DECODER (in the finance office)
   When you're sitting across from the finance manager and they start presenting products — warranties, GAP, protection packages — this tells you exactly what each one costs them, what it's worth, and what to say.`,
    emailNote: null, // set dynamically with expiry date
  },
  guide: {
    name: "Negotiation Guide & Counter Scripts",
    unlocks: ["guide"],
    expiry: null,
    singleUse: true,
    emailIntro: `Your Negotiation Guide & Counter Scripts access is ready. This is your pre-deal playbook — built from the dealer side, written for the buyer.`,
    prepSteps: null,
    emailNote: `Single use, no expiry. Use it when you're ready.`,
  },
};

function generateCode(planId) {
  const prefix = planId.toUpperCase().slice(0, 3);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

function getExpiryDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function formatExpiryDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

async function saveToSupabase(code, planId, expiryISO) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  await fetch(`${url}/rest/v1/access_codes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      code,
      plan_id: planId,
      expiry: expiryISO || null,
      used: false,
      created_at: new Date().toISOString(),
    }),
  });
}

async function sendEmail(to, planId, code, expiryISO) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const config = PLAN_CONFIG[planId];
  const expiryFormatted = expiryISO ? formatExpiryDate(expiryISO) : null;

  const expiryNote = planId === "pro"
    ? `Your access is valid for 7 days. Expires ${expiryFormatted} UTC. Unlimited uses within your window.`
    : config.emailNote;

  const prepSection = config.prepSteps
    ? `\n\n${"─".repeat(60)}\n${config.prepSteps}\n${"─".repeat(60)}`
    : "";

  const body = `
CNTROFR — ${config.name}
${"═".repeat(60)}

${config.emailIntro}
${prepSection}

YOUR ACCESS CODE:

  ${code}

Go to cntrofr.com, click your package, and enter this code at checkout.

${expiryNote}

${"─".repeat(60)}
SECURITY NOTICE

CNTROFR will never contact you asking for personal information, payment details, login credentials, or your access code. If you receive a message claiming to be from CNTROFR and asking for any of this — it did not come from us.

If your code isn't working, check your spam or junk folder first. If you still need help, contact us at info@cntrofr.com.
${"─".repeat(60)}

CNTROFR LLC — Built for buyers. Zero dealer affiliations. Ever.
cntrofr.com | info@cntrofr.com
Don't Sign. Counter.
`.trim();

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "CNTROFR <onboarding@resend.dev>",
      to: [to],
      subject: `Your CNTROFR Access Code — ${config.name}`,
      text: body,
    }),
  });
}

async function verifyStripeSignature(req, body) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return false;

  const encoder = new TextEncoder();
  const parts = sig.split(",");
  const timestamp = parts.find(p => p.startsWith("t="))?.split("=")[1];
  const v1 = parts.find(p => p.startsWith("v1="))?.split("=")[1];
  if (!timestamp || !v1) return false;

  const payload = `${timestamp}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig2 = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const hex = Array.from(new Uint8Array(sig2)).map(b => b.toString(16).padStart(2, "0")).join("");
  return hex === v1;
}

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawBody = await req.text();
  const valid = await verifyStripeSignature(req, rawBody);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);
  if (event.type !== "checkout.session.completed") {
    return new Response("OK", { status: 200 });
  }

  const session = event.data.object;
  const planId = session.metadata?.planId;
  const email = session.customer_details?.email;

  if (!planId || !email || !PLAN_CONFIG[planId]) {
    return new Response("Missing data", { status: 400 });
  }

  const config = PLAN_CONFIG[planId];
  const code = generateCode(planId);
  const expiryISO = config.expiry ? getExpiryDate(config.expiry) : null;

  await saveToSupabase(code, planId, expiryISO);
  await sendEmail(email, planId, code, expiryISO);

  return new Response("OK", { status: 200 });
}
