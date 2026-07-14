// Node.js runtime. Receives real delivery/bounce/open/click events from
// Resend, instead of just trusting that the initial send API call returned
// 200. Resend signs webhooks via Svix -- verification requires the RAW
// request body (not Vercel's auto-parsed JSON), so bodyParser is disabled
// below and the body is read manually before anything touches it.

import crypto from "node:crypto";

export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// Svix signature scheme: HMAC-SHA256 over "{id}.{timestamp}.{rawBody}",
// signed with the base64 portion of the whsec_... secret, compared against
// one or more "v1,<base64sig>" entries in the svix-signature header.
function verifySvixSignature(secret, id, timestamp, rawBody, signatureHeader) {
  if (!secret || !id || !timestamp || !signatureHeader) return false;
  try {
    const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
    const signedContent = `${id}.${timestamp}.${rawBody}`;
    const expected = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");
    const candidates = signatureHeader.split(" ").map(s => s.split(",")[1]).filter(Boolean);
    return candidates.some(sig => {
      try {
        const sigBuf = Buffer.from(sig, "base64");
        const expBuf = Buffer.from(expected, "base64");
        return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    return res.end("Method Not Allowed");
  }

  const rawBody = await getRawBody(req);
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (secret) {
    const valid = verifySvixSignature(
      secret,
      req.headers["svix-id"],
      req.headers["svix-timestamp"],
      rawBody,
      req.headers["svix-signature"]
    );
    if (!valid) {
      console.error("resend-webhook: signature verification failed -- rejecting");
      res.writeHead(401, { "Content-Type": "text/plain" });
      return res.end("Invalid signature");
    }
  } else {
    // No secret configured yet -- accept but log loudly so this doesn't
    // go unnoticed. Set RESEND_WEBHOOK_SECRET as soon as the endpoint
    // is registered in the Resend dashboard.
    console.error("resend-webhook: RESEND_WEBHOOK_SECRET not set -- accepting UNVERIFIED payloads.");
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Invalid JSON");
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const toField = event.data?.to;
      const resp = await fetch(`${supabaseUrl}/rest/v1/email_events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          event_type: event.type || "unknown",
          email_id: event.data?.email_id || null,
          to_address: Array.isArray(toField) ? toField.join(",") : (toField || null),
          subject: event.data?.subject || null,
          bounce_reason: event.data?.bounce?.message || null,
          raw: event,
        }),
      });
      if (!resp.ok) {
        const errBody = await resp.text().catch(() => "");
        console.error("resend-webhook: Supabase insert failed", resp.status, errBody);
      }
    } catch (e) {
      console.error("resend-webhook: Supabase insert threw", e.message);
    }
  } else {
    console.error("resend-webhook: Supabase env vars missing -- event not logged", event.type);
  }

  // Always 200 back to Resend once we've accepted the event, regardless of
  // whether the Supabase log succeeded -- otherwise Resend will retry
  // (up to 10 hours of retries) over something that isn't its fault.
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ received: true }));
}
