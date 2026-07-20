// Node.js runtime (not Edge). Same handler pattern as scan.js/tactic-answer.js.
//
// Wraps the official, free, public NHTSA recall API -- no API key needed,
// no rate limit posted by NHTSA. Recall data is a US federal government
// work and is public domain: https://api.nhtsa.gov/recalls/recallsByVehicle
//
// Verified live against the real API before shipping this -- response shape
// confirmed to match NHTSA's own documented example exactly.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sendJson(res, status, obj) {
  res.writeHead(status, { ...CORS, "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }

  let body = req.body;
  try {
    if (typeof body === "string") body = JSON.parse(body);
    if (!body || typeof body !== "object") throw new Error("empty body");
  } catch {
    return sendJson(res, 400, { error: { message: "Invalid request." } });
  }

  const { make, model, modelYear } = body;
  if (!make || !model || !modelYear) {
    return sendJson(res, 400, { error: { message: "make, model, and modelYear are all required." } });
  }

  // Basic sanitization -- NHTSA's endpoint is picky about extra characters
  // and this is a GET-style query string being built server-side.
  const cleanMake = String(make).trim().slice(0, 40);
  const cleanModel = String(model).trim().slice(0, 40);
  const cleanYear = String(parseInt(modelYear, 10) || "").slice(0, 4);
  if (!cleanMake || !cleanModel || cleanYear.length !== 4) {
    return sendJson(res, 400, { error: { message: "Invalid make, model, or modelYear." } });
  }

  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(cleanMake)}&model=${encodeURIComponent(cleanModel)}&modelYear=${encodeURIComponent(cleanYear)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // NHTSA returns 400 for malformed/unrecognized make+model+year combos --
      // treat as "no data available" rather than a hard error, since a typo'd
      // trim level or an unrecognized model spelling shouldn't break the tool.
      return sendJson(res, 200, { count: 0, recalls: [], note: "No recall data available for this vehicle." });
    }

    const data = await response.json();
    const results = Array.isArray(data.results) ? data.results : [];

    // Trim to what the tool actually needs -- keep it light for the AI prompt.
    const recalls = results.slice(0, 10).map(r => ({
      campaignNumber: r.NHTSACampaignNumber,
      component: r.Component,
      summary: r.Summary,
      consequence: r.Consequence,
      remedy: r.Remedy,
      reportDate: r.ReportReceivedDate,
      parkIt: !!r.parkIt,
      parkOutside: !!r.parkOutSide,
    }));

    return sendJson(res, 200, { count: recalls.length, recalls });
  } catch (error) {
    return sendJson(res, 500, { error: { message: error.message || "Unknown error" } });
  }
}
