"use strict";

/* 간다GO static-site generator. Zero dependencies. Emits the full Seoul
   information site (main + 5 areas + 25 districts + 25 lifezones + 29
   stations + program/use/check/policy pages + sitemap). */

const fs = require("fs");
const path = require("path");

const { SITE } = require("./lib/site");
const reg = require("./data/registry");
const { maps } = reg;
const { esc } = require("./lib/components");
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

const OUT = path.resolve(__dirname, "..");
let written = 0;

function write(routePath, html) {
  // routePath like "/seoul/gangnam-gu/" -> seoul/gangnam-gu/index.html
  let rel = routePath.replace(/^\//, "");
  if (rel === "" || rel.endsWith("/")) rel += "index.html";
  const abs = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, html);
  written++;
}

function emit(page) {
  write(page.path, renderPage(page));
}

/* ---------- breadcrumb helper -------------------------------------- */
const HOME = { name: "서울", href: "/seoul/" };
function bc(...rest) {
  return [HOME, ...rest];
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
    title: `서울 ${area.name} 출장마사지｜자치구·생활권·마사지 프로그램 안내`,
    description: descClamp(
      `서울 ${area.name} 출장마사지·홈타이 예약 전 자치구, 생활권, 역세권과 마사지 프로그램 이용 기준을 안내합니다.`
    ),
    breadcrumb: bc({ name: area.name, href: `/seoul/area/${area.slug}/` }),
    faqs: content.faqs,
    body:
      intro +
      priceSection({ heading: `${area.name} 이용 코스와 요금` }) +
      composeRegion(content, related),
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
    title: `${gu.name} 출장마사지｜생활권·역세권·마사지 프로그램 예약 전 안내`,
    description: descClamp(
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
      composeRegion(content, [...relLifes, ...sibling]),
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
    title: `${life.name} 출장마사지｜생활권 이용 기준·마사지 프로그램 안내`,
    description: descClamp(
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
      composeRegion(content, [...stations, ...relLifes]),
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
    title: `${st.name} 출장마사지｜역세권 이동·이용 장소 예약 전 안내`,
    description: descClamp(
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
      composeRegion(content, related),
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
write("/index.html", renderPage(pages.rootHub()));

/* ================================================================== */
/* robots.txt + XML sitemap                                            */
/* ================================================================== */
buildRobotsAndSitemap();

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
  const robots = `User-agent: *
Allow: /
Sitemap: ${SITE.origin}/sitemap.xml
`;
  fs.writeFileSync(path.join(OUT, "robots.txt"), robots);
  fs.writeFileSync(path.join(OUT, "sitemap.xml"), sitemapXml(urls));
}

function sitemapXml(urls) {
  const body = urls
    .map(
      (u) =>
        `  <url><loc>${SITE.origin}${u}</loc><changefreq>weekly</changefreq></url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function collectUrls() {
  const u = ["/", "/seoul/"];
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
