export const config = { runtime: "edge" };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const PRICE_IDS = {
  firsttime: "price_1TP7lGBz9PmlRkE21ZTCkVgl",
  single:    "price_1TP7mNBz9PmlRkE2znrpdHV0",
  pro:       "price_1TP7npBz9PmlRkE2gFadqAqP",
  guide:     "price_1TP7ohBz9PmlRkE2pnGsS8Ky",
};

export default async function handler(req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: "Stripe not configured." }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  try {
    const { planId } = await req.json();
    const priceId = PRICE_IDS[planId];
    if (!priceId) {
      return new Response(JSON.stringify({ error: "Invalid plan." }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const body = new URLSearchParams({
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "mode": "payment",
      "success_url": `https://cntrofr.com/?success=1&plan=${planId}`,
      "cancel_url": "https://cntrofr.com/?cancelled=1",
      "metadata[planId]": planId,
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const session = await response.json();
    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), {
        status: 400, headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
}
