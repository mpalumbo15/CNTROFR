// Post-build static prerender step.
//
// Why this exists: CNTROFR is a pure client-side SPA (no SSR). Every route is
// served from the same dist/index.html, so any crawler that does NOT execute
// JavaScript sees an identical <title>/description/canonical for every URL on
// the site -- e.g. all 6 /tools/<slug> pages were indistinguishable. This
// script fixes that at the file level: it writes a real dist/<route>/index.html
// per route with the correct <title>, meta description, OG/Twitter tags,
// canonical link, and a short static intro paragraph baked into the initial
// HTML. React still mounts and takes over #root exactly as before for real
// visitors -- this only changes what's in the file before JS runs.
//
// No headless browser required. Run automatically via `npm run build`
// (see the "build" script in package.json).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PATH_TO_VIEW, TAB_TO_SLUG, TOOL_META, PAGE_META } from "../src/seo-meta.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE_URL = "https://cntrofr.com";

function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Build the full route list: every path in PATH_TO_VIEW, plus the 6 individual
//
