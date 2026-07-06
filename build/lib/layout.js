"use strict";

const { SITE } = require("./site");
const {
  esc,
  abs,
  header,
  footer,
  floatingCall,
  mobileBar,
  breadcrumb,
  organizationSchema,
  websiteSchema,
  webPageSchema,
  breadcrumbSchema,
  faqSchema,
} = require("./components");

/* Meta description must stay within 80 characters (per brief). We warn
   loudly at build time rather than silently truncating mid-word. */
function checkDescription(page) {
  const d = page.description || "";
  const len = [...d].length; // count code points, not UTF-16 units
  if (len > 80) {
    throw new Error(
      `[description > 80] (${len}자) ${page.path}\n  → "${d}"`
    );
  }
  if (len === 0) {
    throw new Error(`[description empty] ${page.path}`);
  }
}

/* Assemble the JSON-LD @graph for a page. Only schema types sanctioned by
   the brief are emitted (no LocalBusiness / Review / AggregateRating). */
function buildSchema(page) {
  const graph = [organizationSchema(), websiteSchema(), webPageSchema(page)];
  const bc = breadcrumbSchema(page.breadcrumb);
  if (bc) graph.push(bc);
  const faq = faqSchema(page.faqs);
  if (faq) graph.push(faq);
  if (page.extraSchema) graph.push(...page.extraSchema);
  return { "@context": "https://schema.org", "@graph": graph };
}

/* Full HTML document. `page` fields:
   title, description, path, breadcrumb[], body(html), faqs[], extraSchema[],
   mobileBar(bool default true), noindex(bool), ogImage */
function renderPage(page) {
  checkDescription(page);

  const canonical = abs(page.path);
  const schema = JSON.stringify(buildSchema(page));
  const ogImg = abs(page.ogImage || SITE.ogImage);
  const robots = page.noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large";

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.brand)}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="${SITE.ogImageW}">
<meta property="og:image:height" content="${SITE.ogImageH}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${ogImg}">
<meta name="theme-color" content="#0a0e18">
${SITE.naverVerification ? `<meta name="naver-site-verification" content="${SITE.naverVerification}">` : ""}
${SITE.googleVerification ? `<meta name="google-site-verification" content="${SITE.googleVerification}">` : ""}
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${esc(SITE.brand)} 업데이트" href="/rss.xml">
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/components.css">
<script type="application/ld+json">${schema}</script>
</head>
<body>
<a class="skip-link" href="#main">본문 바로가기</a>
${header()}
${page.breadcrumb ? breadcrumb(page.breadcrumb) : ""}
<main id="main">
${page.body}
</main>
${footer()}
${floatingCall()}
${page.mobileBar === false ? "" : mobileBar()}
<script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}

/* ---------- content-block helpers (used by page data) -------------- */

function sectionHead(eyebrow, title, sub) {
  return `<div class="section-head">
    ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ""}
    <h2>${esc(title)}</h2>
    ${sub ? `<p>${esc(sub)}</p>` : ""}
  </div>`;
}

function linkCards(items) {
  return `<div class="grid grid--auto">${items
    .map(
      (it) =>
        `<a class="card linkcard" href="${it.href}"><span class="name">${esc(
          it.name
        )}</span>${it.meta ? `<span class="meta">${esc(it.meta)}</span>` : ""}</a>`
    )
    .join("")}</div>`;
}

function checklist(items) {
  return `<ul class="checklist">${items
    .map((i) => `<li>${esc(i)}</li>`)
    .join("")}</ul>`;
}

function faqBlock(faqs) {
  if (!faqs || !faqs.length) return "";
  return `<div class="faq">${faqs
    .map(
      (f) =>
        `<details><summary>${esc(f.q)}</summary><div class="answer">${esc(
          f.a
        )}</div></details>`
    )
    .join("")}</div>`;
}

/* Who / How / Why block — required on region & district pages */
function whwBlock(whw) {
  return `<div class="whw">
    <article><h3>Who · 누가</h3><p>${esc(whw.who)}</p></article>
    <article><h3>How · 어떻게</h3><p>${esc(whw.how)}</p></article>
    <article><h3>Why · 왜</h3><p>${esc(whw.why)}</p></article>
  </div>`;
}

function relatedChips(items) {
  return `<div class="related">${items
    .map((i) => `<a class="chip" href="${i.href}">${esc(i.name)}</a>`)
    .join("")}</div>`;
}

const POLICY_NOTICE =
  '<div class="notice">이 페이지는 방문 전 위치·건물 출입·숙소 정책·예약 기준을 확인하기 위한 안내이며, 불법·선정적 서비스는 제공하거나 안내하지 않습니다. 방문 가능 여부는 실제 주소와 예약 조건 확인 후 안내됩니다.</div>';

module.exports = {
  renderPage,
  sectionHead,
  linkCards,
  checklist,
  faqBlock,
  whwBlock,
  relatedChips,
  POLICY_NOTICE,
};
