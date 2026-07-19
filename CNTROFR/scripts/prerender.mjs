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

function buildRoutes() {
  const routes = [];

  for (const [path, view] of Object.entries(PATH_TO_VIEW)) {
    if (view === "tools") continue;
    const meta = PAGE_META[view];
    if (!meta) continue;
    routes.push({ path, title: meta.title, desc: meta.desc, intro: meta.intro });
  }

  for (const [tab, slug] of Object.entries(TAB_TO_SLUG)) {
    const meta = TOOL_META[tab];
    if (!meta) continue;
    routes.push({ path: `/tools/${slug}`, title: meta.title, desc: meta.desc, intro: meta.intro });
  }

  return routes;
}

function outputPathFor(routePath) {
  if (routePath === "/") return join(DIST, "index.html");
  return join(DIST, routePath.replace(/^\//, ""), "index.html");
}

function main() {
  const template = readFileSync(join(DIST, "index.html"), "utf8");
  const routes = buildRoutes();
  let written = 0;

  for (const route of routes) {
    const url = route.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;
    const title = esc(route.title);
    const desc = esc(route.desc || "");

    let html = template;
    html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
    html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`);
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
    html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
    html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
    html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`);
    html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`);
    html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`);

    const introText = route.intro || route.desc;
    if (introText) {
      const h1 = esc(route.title.split(" -- ")[0].split(" | ")[0]);
      const seoStub = `<div id="root"><h1>${h1}</h1><p>${esc(introText)}</p></div>`;
      html = html.replace(/<div id="root"><\/div>/, seoStub);
    }

    const outPath = outputPathFor(route.path);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, "utf8");
    written++;
  }

  console.log(`[prerender] wrote ${written} static route files.`);
}

main();
