// Build step: render <App /> to HTML and inject it into dist/index.html, so
// the page shows its content immediately instead of waiting for JavaScript.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const dist = path.resolve("dist");
const ssrDir = path.resolve("dist-ssr");
const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const file = path.join(dist, "index.html");
let html = fs.readFileSync(file, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("#root placeholder not found in dist/index.html");
html = html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`);

// Preload the two Latin font files (hashed names are only known after build).
const fonts = fs.readdirSync(path.join(dist, "assets")).filter(f => /^(inter|plus-jakarta-sans)-latin-wght-normal-.*\.woff2$/.test(f));
const preloads = fonts.map(f => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`).join("\n        ");
html = html.replace("</title>", `</title>\n        ${preloads}`);

fs.writeFileSync(file, html);
console.log(`Preloaded fonts: ${fonts.join(", ") || "none found"}`);
fs.rmSync(ssrDir, { recursive: true, force: true });
console.log("Pre-rendered dist/index.html");
