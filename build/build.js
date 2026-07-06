"use strict";

/* 간다GO static-site generator. Zero dependencies. Emits the full Seoul
   information site (main + 5 areas + 25 districts + 25 lifezones + 29
   stations + program/use/check/policy pages + sitemap). */

const fs = require("fs");
const path = require("path");

const { SITE } = require("./lib/site");
const reg = require("./data/registry");
const { maps } = reg;
const { esc, abs } = require("./lib/components");
const {
  renderPage,
  sectionHead,
  linkCards,
  checklist,
  faqBlock,
  relatedChips,
  POLICY_NOTICE,
} = require("./lib/layout");
const { composeRegion, regionHero } = require("./lib/compose");
const { priceSection } = require("./lib/pricing");
const { getRegionContent } = require("./lib/content");
const pages = require("./data/pages");

const REPO_ROOT = path.resolve(__dirname, "..");
// OUT_DIR lets CI build a clean artifact dir (assets copied in); default = repo root.
const OUT = process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : REPO_ROOT;
let written = 0;

function withBasePath(html) {
  const bp = SITE.basePath;
  if (!bp) return html;
  // Prefix every in-page root-absolute href/src (starting with a single "/")
  // with the deploy sub-path. Protocol-relative (//) and full URLs are left
  // untouched; canonical/og/schema URLs are already absolute (http...).
  return html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${bp}/`);
}

function write(routePath, html) {
  // routePath like "/seoul/gangnam-gu/" -> seoul/gangnam-gu/index.html
  let rel = routePath.replace(/^\//, "");
  if (rel === "" || rel.endsWith("/")) rel += "index.html";
  const abs = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, withBasePath(html));
  written++;
}

function emit(page) {
  write(page.path, renderPage(page));
}

/* ---------- breadcrumb helper -------------------------------------- */
const HOME = { name: "서울", href: "/" };
function bc(...rest) {
  return [HOME, ...rest];
}

/* Long-tail internal links: descriptive anchors combining the region name with
   programs, venues and checks — strengthens the internal-link graph. */
function longtailFor(name, areaSlug, areaName, programLinks) {
  const progs = (programLinks || []).slice(0, 3).map((p) => ({
    name: `${name} ${p.name} 예약 전 확인`,
    href: p.href,
  }));
  const items = [
    ...progs,
    { name: `${name} 오피스텔 출장마사지 이용 기준`, href: "/seoul/use/officetel/" },
    { name: `${name} 호텔·숙소 방문 정책 확인`, href: "/seoul/use/hotel/" },
    { name: `${name} 아파트·자택 방문 출입 기준`, href: "/seoul/use/apartment/" },
    { name: `${name} 야간 예약 가능 시간 확인`, href: "/seoul/check/time/" },
  ];
  if (areaSlug) items.push({ name: `${areaName} 권역 전체 안내`, href: `/seoul/area/${areaSlug}/` });
  return items;
}

/* ================================================================== */
/* MAIN PAGE                                                            */
/* ================================================================== */
emit(pages.main());

/* ================================================================== */
/* AREA PAGES (5)                                                       */
/* ================================================================== */
reg.AREAS.forEach((area) => {
  const gus = area.gu.map((s) => ({ name: maps.gu[s].name, href: `/seoul/${s}/` }));
  const lifes = area.lifezones.map((s) => ({
    name: maps.life[s].name,
    href: `/seoul/life/${s}/`,
  }));
  const content = getRegionContent("area", area);
  const related = reg.AREAS.filter((a) => a.slug !== area.slug).map((a) => ({
    name: a.name,
    href: `/seoul/area/${a.slug}/`,
  }));

  const intro = `
    ${regionHero(
      "서울 권역 안내",
      `서울 ${area.name} 출장마사지 · 생활권과 프로그램 안내`,
      `${area.name}에 속한 ${gus.length}개 구와 주요 생활권, 역세권, 이용 장소 기준과 마사지 프로그램 선택 기준을 안내합니다.`,
      [
        { label: "마사지 프로그램", href: "/seoul/program/", accent: true },
        { label: "예약 전 확인", href: "/seoul/check/address/" },
      ]
    )}
    <section class="section--tight"><div class="container">
      ${sectionHead("구별 안내", `${area.name} 자치구`)}
      ${linkCards(gus)}
    </div></section>
    <section class="section--tight"><div class="container">
      ${sectionHead("생활권", `${area.name} 주요 생활권`)}
      ${linkCards(lifes)}
    </div></section>`;

  emit({
    path: `/seoul/area/${area.slug}/`,
    title: content.seoTitle || `서울 ${area.name} 출장마사지｜자치구·생활권·마사지 프로그램 안내`,
    description: descClamp(
      content.seoDesc ||
        `서울 ${area.name} 출장마사지·홈타이 예약 전 자치구, 생활권, 역세권과 마사지 프로그램 이용 기준을 안내합니다.`
    ),
    breadcrumb: bc({ name: area.name, href: `/seoul/area/${area.slug}/` }),
    faqs: content.faqs,
    body:
      intro +
      priceSection({ heading: `${area.name} 이용 코스와 요금` }) +
      composeRegion(content, related, longtailFor(area.name, null, area.name, content.programLinks)),
  });
});

/* ================================================================== */
/* DISTRICT PAGES (25)                                                  */
/* ================================================================== */
reg.GU.forEach((gu) => {
  const area = maps.area[gu.area];
  const content = getRegionContent("gu", gu);
  const relLifes = area.lifezones
    .map((s) => maps.life[s])
    .filter((l) => l.area === gu.area)
    .slice(0, 6)
    .map((l) => ({ name: l.name, href: `/seoul/life/${l.slug}/` }));
  const sibling = area.gu
    .filter((s) => s !== gu.slug)
    .map((s) => ({ name: maps.gu[s].name, href: `/seoul/${s}/` }));

  emit({
    path: `/seoul/${gu.slug}/`,
    title: content.seoTitle || `${gu.name} 출장마사지｜생활권·역세권·마사지 프로그램 예약 전 안내`,
    description: descClamp(
      content.seoDesc ||
        `서울 ${gu.name} 출장마사지·홈타이 예약 전 생활권, 역세권, 호텔·오피스텔·아파트 이용 기준과 프로그램을 안내합니다.`
    ),
    breadcrumb: bc(
      { name: area.name, href: `/seoul/area/${area.slug}/` },
      { name: gu.name, href: `/seoul/${gu.slug}/` }
    ),
    faqs: content.faqs,
    body:
      regionHero(
        `${area.name} · ${gu.name}`,
        `${gu.name} 출장마사지 · 생활권과 마사지 프로그램 안내`,
        `${gu.name}의 주요 생활권과 가까운 역세권, 호텔·오피스텔·아파트 이용 기준, 마사지 프로그램 선택 기준을 예약 전에 안내합니다.`,
        [
          { label: "마사지 프로그램", href: "/seoul/program/", accent: true },
          { label: `${area.name} 전체`, href: `/seoul/area/${area.slug}/` },
        ]
      ) +
      priceSection({ heading: `${gu.name} 이용 코스와 요금` }) +
      composeRegion(
        content,
        [...relLifes, ...sibling],
        longtailFor(gu.name, gu.area, area.name, content.programLinks)
      ),
  });
});

/* ================================================================== */
/* LIFEZONE PAGES (25)                                                  */
/* ================================================================== */
reg.LIFEZONES.forEach((life) => {
  const area = maps.area[life.area];
  const content = getRegionContent("life", life);
  const stations = reg.STATIONS.filter((s) => s.life === life.slug).map((s) => ({
    name: s.name,
    href: `/seoul/station/${s.slug}/`,
  }));
  const relLifes = reg.LIFEZONES.filter(
    (l) => l.area === life.area && l.slug !== life.slug
  )
    .slice(0, 5)
    .map((l) => ({ name: l.name, href: `/seoul/life/${l.slug}/` }));

  emit({
    path: `/seoul/life/${life.slug}/`,
    title: content.seoTitle || `${life.name} 출장마사지｜생활권 이용 기준·마사지 프로그램 안내`,
    description: descClamp(
      content.seoDesc ||
        `서울 ${life.name} 생활권 출장마사지 예약 전 역세권, 숙소·오피스텔·아파트 이용 기준과 마사지 프로그램을 안내합니다.`
    ),
    breadcrumb: bc(
      { name: area.name, href: `/seoul/area/${area.slug}/` },
      { name: life.name, href: `/seoul/life/${life.slug}/` }
    ),
    faqs: content.faqs,
    body:
      regionHero(
        `${area.name} 생활권`,
        `${life.name} 출장마사지 · 생활권 이용 기준 안내`,
        `${life.name} 생활권의 이동 기준, 숙소·오피스텔·아파트 이용 확인사항과 마사지 프로그램 선택 기준을 안내합니다.`,
        [
          { label: "마사지 프로그램", href: "/seoul/program/", accent: true },
          { label: "예약 전 확인", href: "/seoul/check/address/" },
        ]
      ) +
      priceSection({ heading: `${life.name} 이용 코스와 요금` }) +
      composeRegion(
        content,
        [...stations, ...relLifes],
        longtailFor(life.name, life.area, area.name, content.programLinks)
      ),
  });
});

/* ================================================================== */
/* STATION PAGES (29)                                                   */
/* ================================================================== */
reg.STATIONS.forEach((st) => {
  const life = maps.life[st.life];
  const area = maps.area[life.area];
  const content = getRegionContent("station", st);
  const siblings = reg.STATIONS.filter(
    (s) => s.life === st.life && s.slug !== st.slug
  ).map((s) => ({ name: s.name, href: `/seoul/station/${s.slug}/` }));
  const related = [
    { name: `${life.name} 생활권`, href: `/seoul/life/${life.slug}/` },
    ...siblings,
  ];

  emit({
    path: `/seoul/station/${st.slug}/`,
    title: content.seoTitle || `${st.name} 출장마사지｜역세권 이동·이용 장소 예약 전 안내`,
    description: descClamp(
      content.seoDesc ||
        `서울 ${st.name} 역세권 출장마사지 예약 전 이동 기준, 숙소·오피스텔·업무지구 이용 확인사항을 안내합니다.`
    ),
    breadcrumb: bc(
      { name: area.name, href: `/seoul/area/${area.slug}/` },
      { name: life.name, href: `/seoul/life/${life.slug}/` },
      { name: st.name, href: `/seoul/station/${st.slug}/` }
    ),
    faqs: content.faqs,
    body:
      regionHero(
        `${life.name} · 역세권`,
        `${st.name} 출장마사지 · 역세권 이용 기준 안내`,
        `${st.name} 주변 이동 기준과 숙소·오피스텔·업무지구 이용 확인사항, 마사지 프로그램 선택 기준을 안내합니다.`,
        [
          { label: `${life.name} 생활권`, href: `/seoul/life/${life.slug}/`, accent: true },
          { label: "마사지 프로그램", href: "/seoul/program/" },
        ]
      ) +
      priceSection({ heading: `${st.name} 이용 코스와 요금` }) +
      composeRegion(
        content,
        related,
        longtailFor(st.name, life.area, area.name, content.programLinks)
      ),
  });
});

/* ================================================================== */
/* PROGRAM PAGES (main + 11)                                            */
/* ================================================================== */
emit(pages.programMain());
reg.PROGRAMS.forEach((pr) => emit(pages.program(pr)));

/* ================================================================== */
/* USE (9), CHECK (13)                                                  */
/* ================================================================== */
reg.USE.forEach((u) => emit(pages.use(u)));
reg.CHECK.forEach((c) => emit(pages.check(c)));

/* ================================================================== */
/* MISC: contact, about, sitemap, root                                 */
/* ================================================================== */
emit(pages.contact());
emit(pages.about());
emit(pages.sitemapPage());
// The homepage now lives at "/" (pages.main). Keep the old /seoul/ URL working
// by redirecting it to the root, canonicalised to "/".
write("/seoul/", redirectHtml("/"));

/* ================================================================== */
/* robots.txt + XML sitemap                                            */
/* ================================================================== */
buildRobotsAndSitemap();

// When building into a separate artifact dir, bring the static assets along
// and drop a .nojekyll so GitHub Pages serves files verbatim.
if (OUT !== REPO_ROOT) {
  fs.cpSync(path.join(REPO_ROOT, "assets"), path.join(OUT, "assets"), { recursive: true });
  fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
}

console.log(`\n✅ ${written} pages written to ${OUT}`);

/* ---------- utilities ---------------------------------------------- */
function descClamp(s) {
  const arr = [...s];
  if (arr.length <= 80) return s;
  // keep to 80 code points without cutting mid-sentence awkwardly
  return arr.slice(0, 79).join("").replace(/[\s,·]+$/, "") + "";
}

function buildRobotsAndSitemap() {
  const urls = collectUrls();
  // Explicitly welcome Google, Naver(Yeti), Bing; point them at the sitemap.
  const robots = `# 간다GO robots.txt
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Yeti
Allow: /

User-agent: NaverBot
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${SITE.canonicalBase}/sitemap.xml
`;
  fs.writeFileSync(path.join(OUT, "robots.txt"), robots);
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemapXml(urls));
  fs.writeFileSync(path.join(OUT, "rss.xml"), rssXml(urls));
}

function sitemapXml(urls) {
  const lastmod = SITE.reviewDate;
  const body = urls
    .map((u) => {
      const priority = u === "/" ? "1.0" : u.split("/").length <= 3 ? "0.8" : "0.6";
      const freq = u === "/" ? "daily" : "weekly";
      return `  <url><loc>${SITE.canonicalBase}${u}</loc><lastmod>${lastmod}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

/* RSS 2.0 feed — supplementary discovery channel for Naver/Google. */
function rssXml(urls) {
  const pub = new Date(SITE.reviewDate + "T00:00:00+09:00").toUTCString();
  const items = urls
    .map(
      (u) =>
        `    <item>
      <title>${xmlEsc(labelForUrl(u))}</title>
      <link>${SITE.canonicalBase}${u}</link>
      <guid isPermaLink="true">${SITE.canonicalBase}${u}</guid>
      <pubDate>${pub}</pubDate>
    </item>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEsc(SITE.brand)} — 서울 출장마사지 지역·프로그램 안내</title>
    <link>${SITE.canonicalBase}/</link>
    <atom:link href="${SITE.canonicalBase}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>서울 25개 구·생활권·역세권과 마사지 프로그램 예약 전 확인 안내</description>
    <language>ko</language>
    <lastBuildDate>${pub}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function xmlEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function labelForUrl(u) {
  if (u === "/") return `${SITE.brand} 서울 출장마사지 메인`;
  for (const a of reg.AREAS) if (u === `/seoul/area/${a.slug}/`) return `${a.name} 출장마사지 안내`;
  for (const g of reg.GU) if (u === `/seoul/${g.slug}/`) return `${g.name} 출장마사지 안내`;
  for (const l of reg.LIFEZONES) if (u === `/seoul/life/${l.slug}/`) return `${l.name} 출장마사지 안내`;
  for (const s of reg.STATIONS) if (u === `/seoul/station/${s.slug}/`) return `${s.name} 출장마사지 안내`;
  for (const p of reg.PROGRAMS) if (u === `/seoul/program/${p.slug}/`) return `서울 ${p.name} 안내`;
  for (const x of reg.USE) if (u === `/seoul/use/${x.slug}/`) return x.h1;
  for (const c of reg.CHECK) if (u === `/seoul/check/${c.slug}/`) return `${c.h1}`;
  if (u === "/seoul/program/") return "서울 마사지 프로그램 안내";
  if (u === "/seoul/contact/") return "문의하기";
  if (u === "/seoul/about/") return "운영 기준";
  if (u === "/seoul/sitemap/") return "사이트맵";
  return u;
}

/* Minimal HTML redirect page (canonicalised) for retired URLs. */
function redirectHtml(target) {
  const dest = abs(target); // full URL incl. origin + basePath
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<title>${SITE.brand} 서울 출장마사지</title>
<link rel="canonical" href="${dest}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${dest}">
</head><body>이 페이지는 <a href="${dest}">간다GO 메인</a>으로 이동합니다.</body></html>`;
}

function collectUrls() {
  const u = ["/"];
  reg.AREAS.forEach((a) => u.push(`/seoul/area/${a.slug}/`));
  reg.GU.forEach((g) => u.push(`/seoul/${g.slug}/`));
  reg.LIFEZONES.forEach((l) => u.push(`/seoul/life/${l.slug}/`));
  reg.STATIONS.forEach((s) => u.push(`/seoul/station/${s.slug}/`));
  u.push("/seoul/program/");
  reg.PROGRAMS.forEach((p) => u.push(`/seoul/program/${p.slug}/`));
  reg.USE.forEach((x) => u.push(`/seoul/use/${x.slug}/`));
  reg.CHECK.forEach((c) => u.push(`/seoul/check/${c.slug}/`));
  u.push("/seoul/contact/", "/seoul/about/", "/seoul/sitemap/");
  return u;
}
