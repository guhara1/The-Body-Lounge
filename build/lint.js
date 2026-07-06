"use strict";

/* Post-build validator: description length, JSON-LD validity, internal link
   integrity, and minimum article length on indexable pages. Exits non-zero
   on hard failures so CI / the build can catch regressions. */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const htmlFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === "build") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) htmlFiles.push(p);
  }
})(ROOT);

let errors = 0;
let warns = 0;
const routes = new Set();

for (const f of htmlFiles) {
  const rel = "/" + path.relative(ROOT, f).replace(/index\.html$/, "").replace(/\\/g, "/");
  routes.add(rel);
}

for (const f of htmlFiles) {
  const h = fs.readFileSync(f, "utf8");
  const rel = path.relative(ROOT, f);

  // description length
  const dm = h.match(/<meta name="description" content="([^"]*)"/);
  if (!dm) {
    console.error(`✗ ${rel}: missing meta description`);
    errors++;
  } else if ([...dm[1]].length > 80) {
    console.error(`✗ ${rel}: description ${[...dm[1]].length} chars > 80`);
    errors++;
  }

  // title present
  if (!/<title>[^<]+<\/title>/.test(h)) {
    console.error(`✗ ${rel}: missing/empty title`);
    errors++;
  }

  // JSON-LD parse
  const ld = h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!ld) {
    console.error(`✗ ${rel}: missing JSON-LD`);
    errors++;
  } else {
    try {
      const j = JSON.parse(ld[1]);
      if (!j["@graph"] || !j["@graph"].length) throw new Error("empty @graph");
    } catch (e) {
      console.error(`✗ ${rel}: invalid JSON-LD (${e.message})`);
      errors++;
    }
  }

  // required chrome
  if (!h.includes("float-call")) { console.error(`✗ ${rel}: missing floating call button`); errors++; }
  if (!h.includes("tel:0508-202-4719")) { console.error(`✗ ${rel}: missing tel link`); errors++; }

  // internal link integrity (same-origin absolute paths only)
  const links = [...h.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]);
  for (const l of links) {
    if (l.startsWith("/assets/")) continue;
    const norm = l.endsWith("/") || /\.[a-z]+$/.test(l) ? l : l + "/";
    if (/\.[a-z]+$/.test(norm)) continue; // file asset
    if (!routes.has(norm)) {
      console.error(`✗ ${rel}: broken internal link → ${l}`);
      errors++;
    }
  }

  // article length (indexable, non-check quick pages get a softer bar)
  const isRegion = /(seoul\/(area|life|station)\/|seoul\/[a-z]+-gu\/)/.test(rel);
  if (isRegion) {
    const text = h
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if ([...text].length < 1400) {
      console.warn(`⚠ ${rel}: article text ${[...text].length} chars (aim ≥ 2000 body)`);
      warns++;
    }
  }
}

console.log(`\n${htmlFiles.length} pages · ${errors} errors · ${warns} warnings`);
if (errors) process.exit(1);
