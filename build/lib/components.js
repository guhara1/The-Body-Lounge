"use strict";

const { SITE } = require("./site");
const { ICONS } = require("./icons");

/* ---------- helpers ------------------------------------------------- */
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function abs(path) {
  if (/^https?:/.test(path)) return path;
  return SITE.canonicalBase + (path.startsWith("/") ? path : "/" + path);
}

/* ---------- navigation config -------------------------------------- */
const NAV = [
  { label: "서울 홈", href: "/" },
  {
    label: "권역별 안내",
    href: "/seoul/area/gangnam-southeast/",
    children: [
      { label: "강남·동남권", href: "/seoul/area/gangnam-southeast/" },
      { label: "서남권", href: "/seoul/area/southwest/" },
      { label: "서북권", href: "/seoul/area/northwest/" },
      { label: "동북권", href: "/seoul/area/northeast/" },
      { label: "도심·중부권", href: "/seoul/area/central/" },
    ],
  },
  {
    label: "구별 안내",
    href: "/seoul/gangnam-gu/",
    children: [
      { label: "강남구", href: "/seoul/gangnam-gu/" },
      { label: "서초구", href: "/seoul/seocho-gu/" },
      { label: "송파구", href: "/seoul/songpa-gu/" },
      { label: "영등포구", href: "/seoul/yeongdeungpo-gu/" },
      { label: "마포구", href: "/seoul/mapo-gu/" },
      { label: "용산구", href: "/seoul/yongsan-gu/" },
      { label: "성동구", href: "/seoul/seongdong-gu/" },
      { label: "전체 구 보기", href: "/seoul/#gu" },
    ],
  },
  {
    label: "마사지 프로그램",
    href: "/seoul/program/",
    children: [
      { label: "스웨디시", href: "/seoul/program/swedish/" },
      { label: "타이마사지", href: "/seoul/program/thai-massage/" },
      { label: "아로마테라피", href: "/seoul/program/aroma-therapy/" },
      { label: "스포츠 마사지", href: "/seoul/program/sports-massage/" },
      { label: "발마사지", href: "/seoul/program/foot-massage/" },
      { label: "딥티슈", href: "/seoul/program/deep-tissue/" },
      { label: "로미로미", href: "/seoul/program/lomi-lomi/" },
      { label: "프로그램 전체", href: "/seoul/program/" },
    ],
  },
  {
    label: "이용 장소",
    href: "/seoul/use/home/",
    children: [
      { label: "자택", href: "/seoul/use/home/" },
      { label: "호텔·숙소", href: "/seoul/use/hotel/" },
      { label: "오피스텔", href: "/seoul/use/officetel/" },
      { label: "아파트", href: "/seoul/use/apartment/" },
      { label: "업무지구", href: "/seoul/use/business-district/" },
      { label: "역세권", href: "/seoul/use/station-area/" },
      { label: "관광 숙소", href: "/seoul/use/tour-accommodation/" },
    ],
  },
  {
    label: "예약 전 확인",
    href: "/seoul/check/address/",
    children: [
      { label: "주소 확인", href: "/seoul/check/address/" },
      { label: "건물 출입", href: "/seoul/check/building-access/" },
      { label: "호텔 정책", href: "/seoul/check/hotel-policy/" },
      { label: "오피스텔 규정", href: "/seoul/check/officetel-rule/" },
      { label: "예약 시간", href: "/seoul/check/time/" },
      { label: "변경 기준", href: "/seoul/check/change-policy/" },
      { label: "개인정보", href: "/seoul/check/privacy/" },
      { label: "불법·선정적 서비스 불가", href: "/seoul/check/service-policy/" },
    ],
  },
  { label: "문의하기", href: "/seoul/contact/" },
];

/* ---------- header -------------------------------------------------- */
function header() {
  const menu = NAV.map((item) => {
    if (item.children) {
      const dd = item.children
        .map((c) => `<a href="${c.href}">${esc(c.label)}</a>`)
        .join("");
      return `<li class="has-dd"><a class="nav-link" href="${item.href}">${esc(
        item.label
      )} ▾</a><div class="dropdown">${dd}</div></li>`;
    }
    return `<li><a class="nav-link" href="${item.href}">${esc(item.label)}</a></li>`;
  }).join("");

  const mobile = NAV.map((item) => {
    if (item.children) {
      const sub = item.children
        .map((c) => `<a href="${c.href}">${esc(c.label)}</a>`)
        .join("");
      return `<details><summary>${esc(
        item.label
      )}</summary><div class="sub">${sub}</div></details>`;
    }
    return `<details><summary><a href="${item.href}" style="color:inherit">${esc(
      item.label
    )}</a></summary></details>`;
  }).join("");

  return `
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="/" aria-label="${esc(SITE.brand)} 홈">
        <span class="brand__mark">간</span><span>간다<span class="go">GO</span></span>
      </a>
      <nav aria-label="주요 메뉴">
        <ul class="nav-menu">${menu}</ul>
      </nav>
      <div class="nav-cta">
        <a class="btn btn--accent btn--desktop" href="${SITE.phoneHref}">${ICONS.phone} 전화 예약</a>
        <button class="nav-toggle" aria-label="메뉴 열기" aria-controls="mobile-panel" aria-expanded="false">${ICONS.menu}</button>
      </div>
    </div>
    <div class="mobile-panel" id="mobile-panel">
      ${mobile}
      <div style="margin-top:24px;display:grid;gap:10px">
        <a class="btn btn--accent btn--block btn--lg" href="${SITE.phoneHref}">${ICONS.phone} 전화 예약 ${esc(SITE.phone)}</a>
        <a class="btn btn--ghost btn--block" href="/seoul/contact/">문의하기</a>
      </div>
    </div>
  </header>`;
}

/* ---------- footer (with orange Telegram inquiry buttons) ---------- */
function footer() {
  const cols = [
    {
      h: "지역 안내",
      links: [
        ["서울 메인", "/"],
        ["강남·동남권", "/seoul/area/gangnam-southeast/"],
        ["서남권", "/seoul/area/southwest/"],
        ["서북권", "/seoul/area/northwest/"],
        ["동북권", "/seoul/area/northeast/"],
        ["도심·중부권", "/seoul/area/central/"],
      ],
    },
    {
      h: "이용 안내",
      links: [
        ["마사지 프로그램", "/seoul/program/"],
        ["이용 장소", "/seoul/use/home/"],
        ["예약 전 확인", "/seoul/check/address/"],
        ["개인정보 처리방침", "/seoul/check/privacy/"],
        ["불법·선정적 서비스 불가", "/seoul/check/service-policy/"],
        ["사이트맵", "/seoul/sitemap/"],
      ],
    },
  ];

  const colHtml = cols
    .map(
      (c) =>
        `<div><h4>${esc(c.h)}</h4><ul>${c.links
          .map(([t, h]) => `<li><a href="${h}">${esc(t)}</a></li>`)
          .join("")}</ul></div>`
    )
    .join("");

  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-cta">
        <a class="btn btn--accent btn--lg" href="${SITE.telegram.build}" target="_blank" rel="noopener nofollow">${ICONS.telegram} 웹사이트 제작문의</a>
        <a class="btn btn--accent btn--lg" href="${SITE.telegram.partner}" target="_blank" rel="noopener nofollow">${ICONS.telegram} 제휴문의</a>
      </div>
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/"><span class="brand__mark">간</span><span>간다<span class="go">GO</span></span></a>
          <p>서울 25개 구·주요 생활권과 스웨디시·아로마·타이·스포츠 마사지 프로그램의 예약 전 확인사항을 안내하는 정보 사이트입니다.</p>
          <div class="footer-contact">
            <div>상호: <strong>${esc(SITE.brand)}</strong></div>
            <div>전화 예약: <a class="tel" href="${SITE.phoneHref}">${esc(SITE.phone)}</a></div>
          </div>
        </div>
        ${colHtml}
      </div>
      <div class="footer-legal">
        <span>© <span data-year="${SITE.buildYear}">${SITE.buildYear}</span> ${esc(SITE.brand)}. 방문형 웰니스 정보 안내.</span>
        <span>불법·선정적 서비스는 제공하거나 안내하지 않습니다.</span>
      </div>
    </div>
  </footer>`;
}

/* ---------- 16:9 hero image band (below the hero box) -------------- */
/* Renders a 16:9 banner. Until the image is uploaded to SITE.heroImage the
   <img> onerror hides itself, revealing the branded placeholder behind it,
   so a missing file never shows a broken-image icon. */
function heroImageBand(alt) {
  const src = SITE.heroImage;
  if (!src) return "";
  const a = esc(alt || SITE.heroImageAlt || SITE.brand);
  return `<section class="hero-media-wrap" aria-label="대표 이미지"><div class="container">
    <figure class="hero-media">
      <img src="${src}" alt="${a}" width="1280" height="720" loading="eager" decoding="async"
        onerror="this.style.display='none';this.parentNode.classList.add('is-empty')">
    </figure>
  </div></section>`;
}

/* ---------- floating call button (mobile, all pages) --------------- */
function floatingCall() {
  return `<a class="float-call" href="${SITE.phoneHref}" aria-label="전화 예약 ${esc(
    SITE.phone
  )}"><span class="float-call__label">전화 예약</span>${ICONS.phone}</a>`;
}

/* ---------- mobile bottom action bar ------------------------------- */
function mobileBar() {
  return `
  <nav class="mobile-bar" aria-label="빠른 이용">
    <a href="${SITE.phoneHref}" class="primary">${ICONS.phone}<span>전화 문의</span></a>
    <a href="/seoul/program/">${ICONS.list}<span>프로그램</span></a>
    <a href="/seoul/check/address/">${ICONS.check}<span>예약 전 확인</span></a>
    <a href="/seoul/contact/">${ICONS.message}<span>문의</span></a>
  </nav>`;
}

/* ---------- breadcrumb --------------------------------------------- */
function breadcrumb(trail) {
  if (!trail || !trail.length) return "";
  const items = trail
    .map((t, i) =>
      i < trail.length - 1
        ? `<li><a href="${t.href}">${esc(t.name)}</a></li>`
        : `<li aria-current="page">${esc(t.name)}</li>`
    )
    .join("");
  return `<nav class="breadcrumb" aria-label="위치"><div class="container"><ol>${items}</ol></div></nav>`;
}

/* ---------- JSON-LD schema builders -------------------------------- */
const { RATING } = require("../data/reviews");

function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": SITE.canonicalBase + "/#organization",
    name: SITE.brand,
    alternateName: SITE.brandLatin,
    url: SITE.canonicalBase + "/",
    telephone: SITE.phone,
    image: abs(SITE.ogImage),
    logo: abs(SITE.ogImage),
    areaServed: { "@type": "City", name: "서울특별시" },
    // Site-wide aggregate score (full review list is emitted on the homepage).
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: RATING.avg,
      reviewCount: RATING.count,
      bestRating: "5",
      worstRating: "1",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "reservations",
      areaServed: "KR",
      availableLanguage: ["ko"],
    },
  };
}

function webPageSchema(page) {
  const img = {
    "@type": "ImageObject",
    url: abs(page.ogImage || SITE.ogImage),
    width: SITE.ogImageW,
    height: SITE.ogImageH,
  };
  return {
    "@type": "WebPage",
    "@id": abs(page.path) + "#webpage",
    url: abs(page.path),
    name: page.title,
    description: page.description,
    inLanguage: "ko",
    isPartOf: { "@id": SITE.canonicalBase + "/#website" },
    primaryImageOfPage: img,
    image: img,
    datePublished: SITE.reviewDate,
    dateModified: SITE.reviewDate,
    author: { "@id": SITE.canonicalBase + "/#organization", name: SITE.author },
    reviewedBy: { "@id": SITE.canonicalBase + "/#organization" },
    publisher: { "@id": SITE.canonicalBase + "/#organization" },
  };
}

function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE.canonicalBase + "/#website",
    url: SITE.canonicalBase + "/seoul/",
    name: SITE.brand,
    inLanguage: "ko",
    publisher: { "@id": SITE.canonicalBase + "/#organization" },
  };
}

function breadcrumbSchema(trail) {
  if (!trail || !trail.length) return null;
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.href),
    })),
  };
}

function faqSchema(faqs) {
  if (!faqs || !faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

module.exports = {
  esc,
  abs,
  NAV,
  header,
  footer,
  heroImageBand,
  floatingCall,
  mobileBar,
  breadcrumb,
  organizationSchema,
  webPageSchema,
  websiteSchema,
  breadcrumbSchema,
  faqSchema,
};
