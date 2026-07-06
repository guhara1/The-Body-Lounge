"use strict";

const { SITE } = require("./site");
const { esc } = require("./components");

/* Shared massage price table (60·90·120분). Used on the main page and on
   every region page so 요금 안내 is consistent site-wide. `regionName`, when
   given, personalizes the heading so each page's block is not identical
   boilerplate. */
const PRICES = [
  { tier: "60분 코스", amount: "90,000", dur: "60분", desc: "기본 컨디션·릴렉스 케어", tag: false },
  { tier: "90분 코스", amount: "150,000", dur: "90분", desc: "아로마 포함 추천 구성", tag: true },
  { tier: "120분 코스", amount: "180,000", dur: "120분", desc: "전신 집중 프리미엄 케어", tag: false },
];

function priceCards() {
  return PRICES.map(
    (p) => `
    <div class="card ${p.tag ? "card--accent" : ""} price">
      ${p.tag ? '<span class="tag">추천</span>' : ""}
      <div class="tier">${p.tier}</div>
      <div class="amount">${p.amount}<small>원</small></div>
      <div class="dur">${p.dur}</div>
      <div class="desc">${p.desc}</div>
      <a class="btn ${p.tag ? "btn--accent" : "btn--outline-accent"} btn--block" href="${SITE.phoneHref}" aria-label="${esc(p.tier)} 예약 문의">예약 문의</a>
    </div>`
  ).join("");
}

/* Full <section> block. `heading`/`sub` override defaults. */
function priceSection(opts) {
  opts = opts || {};
  const heading = opts.heading || "이용 코스와 요금 살펴보기";
  const sub =
    opts.sub ||
    "60·90·120분 코스별 기준 요금이며, 지역·예약 시간대·이동 거리에 따라 상담 시 최종 확인됩니다.";
  const noteRegion = opts.regionNote
    ? `${esc(opts.regionNote)} `
    : "";
  return `<section class="section--tight" aria-label="이용 요금"><div class="container">
    <div class="section-head">
      <span class="eyebrow">요금 안내</span>
      <h2>${esc(heading)}</h2>
      <p>${esc(sub)}</p>
    </div>
    <div class="price-grid">${priceCards()}</div>
    <p class="center text-muted" style="margin-top:24px">${noteRegion}지역·예약 시간대·이동 거리에 따라 상담 시 최종 확인됩니다. <a class="text-accent" href="/seoul/check/time/">상세 이용 기준 보기 →</a></p>
  </div></section>`;
}

module.exports = { priceSection, PRICES };
