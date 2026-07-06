"use strict";

const {
  sectionHead,
  checklist,
  faqBlock,
  whwBlock,
  relatedChips,
  POLICY_NOTICE,
} = require("./layout");
const { esc } = require("./components");

function paras(arr) {
  if (!arr) return "";
  return (Array.isArray(arr) ? arr : [arr])
    .map((p) => `<p>${p}</p>`)
    .join("");
}
function bullets(arr) {
  if (!arr || !arr.length) return "";
  return `<ul>${arr.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}

/* Shared privacy + service-policy H2 bodies (same guidance, linked out). */
const PRIVACY_BODY =
  '예약 확인과 연락에 필요한 최소 정보만 확인하며, 상담 종료 후에는 목적이 끝난 정보를 보관하지 않는 것을 원칙으로 합니다. 자세한 처리 기준은 <a href="/seoul/check/privacy/">개인정보 처리 기준</a> 페이지에서 확인할 수 있습니다.';
const SERVICE_BODY =
  '이 사이트는 방문형 웰니스 정보 안내를 목적으로 하며, 불법·선정적 서비스는 제공하거나 암시하지 않습니다. 이용 기준은 <a href="/seoul/check/service-policy/">불법·선정적 서비스 불가 안내</a> 페이지에 정리되어 있습니다.';

/* Compose a region-style article body (area / district / lifezone / station).
   `c` is the authored content object. `related` is a list of {name,href}. */
function composeRegion(c, related) {
  const secs = [];

  secs.push(`<section class="section section--tight"><div class="container container--narrow">`);
  secs.push(`<div class="prose">`);

  secs.push(`<h2>이 지역의 생활권 특징</h2>${paras(c.lifeFeature)}`);
  secs.push(`<h2>가까운 역세권과 이동 기준</h2>${paras(c.access)}`);
  if (c.accessList) secs.push(bullets(c.accessList));

  secs.push(`<h2>호텔·숙소 이용 전 확인</h2>${paras(c.hotel)}`);
  secs.push(`<h2>오피스텔 이용 전 확인</h2>${paras(c.officetel)}`);
  secs.push(`<h2>아파트·자택 이용 전 확인</h2>${paras(c.apartment)}`);
  secs.push(`<h2>업무지구·관광 숙소 이용 기준</h2>${paras(c.business)}`);

  secs.push(`<h2>마사지 프로그램 선택 기준</h2>${paras(c.programGuide)}`);
  if (c.programLinks) {
    secs.push(
      relatedChips(c.programLinks)
    );
  }

  secs.push(`<h2>예약 전 체크리스트</h2>`);
  secs.push(checklist(c.checklist || defaultChecklist()));

  secs.push(`<h2>개인정보 처리 기준</h2><p>${PRIVACY_BODY}</p>`);
  secs.push(`<h2>불법·선정적 서비스 불가 안내</h2><p>${SERVICE_BODY}</p>`);
  secs.push(POLICY_NOTICE);

  secs.push(`<h2>자주 묻는 질문</h2>${faqBlock(c.faqs)}`);

  secs.push(`<h2>Who, How, Why</h2>${whwBlock(c.whw)}`);

  secs.push(
    `<h2>참고 자료</h2><p>지역·행정 구조는 <a href="https://www.seoul.go.kr/" target="_blank" rel="noopener nofollow">서울특별시 공식 홈페이지</a>와 해당 자치구 홈페이지를, 지하철 이동 정보는 <a href="https://www.seoulmetro.co.kr/" target="_blank" rel="noopener nofollow">서울교통공사</a> 안내를 참고해 정리했습니다. 실제 방문 가능 여부와 건물 출입 방식은 예약 시 최종 확인됩니다.</p>`
  );

  if (related && related.length) {
    secs.push(`<h2>관련 지역 보기</h2>${relatedChips(related)}`);
  }

  secs.push(`</div></div></section>`);
  return secs.join("\n");
}

function defaultChecklist() {
  return [
    "방문 주소를 정확히 확인했나요?",
    "가까운 생활권과 역세권을 확인했나요?",
    "이용하려는 마사지 프로그램을 확인했나요?",
    "호텔·오피스텔·아파트 출입 방식을 확인했나요?",
    "예약 가능 시간과 변경 기준을 확인했나요?",
    "개인정보 처리 기준을 확인했나요?",
    "불법·선정적 서비스 불가 안내를 확인했나요?",
  ];
}

/* Region-style page hero (compact). */
function regionHero(kicker, h1, lead, ctas) {
  const cta = (ctas || [])
    .map(
      (c) =>
        `<a class="btn ${c.accent ? "btn--accent" : "btn--ghost"}" href="${c.href}">${esc(
          c.label
        )}</a>`
    )
    .join("");
  return `<section class="hero section--tight"><div class="container">
    <div class="hero__inner">
      <span class="eyebrow">${esc(kicker)}</span>
      <h1>${esc(h1)}</h1>
      <p class="lead">${esc(lead)}</p>
      ${cta ? `<div class="hero__cta">${cta}</div>` : ""}
    </div>
  </div></section>`;
}

module.exports = { composeRegion, regionHero, sectionHead, paras, bullets };
