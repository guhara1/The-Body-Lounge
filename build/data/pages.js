"use strict";

const { SITE } = require("../lib/site");
const reg = require("./registry");
const { maps } = reg;
const { esc, heroImageBand } = require("../lib/components");
const { ICONS } = require("../lib/icons");
const {
  sectionHead,
  linkCards,
  checklist,
  faqBlock,
  relatedChips,
  whwBlock,
  POLICY_NOTICE,
} = require("../lib/layout");
const { regionHero, byline } = require("../lib/compose");
const { priceSection } = require("../lib/pricing");

const HOME = { name: "서울", href: "/" };
function descClamp(s) {
  const a = [...s];
  return a.length <= 80 ? s : a.slice(0, 80).join("");
}
function proseWrap(inner) {
  return `<section class="section--tight"><div class="container container--narrow"><div class="prose">${byline()}${inner}</div></div></section>`;
}
function P(arr) {
  return arr.map((p) => `<p>${p}</p>`).join("");
}
const PRIVACY_H2 =
  '<h2>개인정보 처리 기준</h2><p>예약 확인과 연락에 필요한 최소 정보만 확인하며, 목적이 끝난 정보는 보관하지 않는 것을 원칙으로 합니다. 자세한 내용은 <a href="/seoul/check/privacy/">개인정보 처리 기준</a>에서 확인하세요.</p>';
const SERVICE_H2 =
  '<h2>불법·선정적 서비스 불가 안내</h2><p>이 사이트는 방문형 웰니스 정보 안내를 목적으로 하며, 불법·선정적 서비스는 제공하거나 암시하지 않습니다. 기준은 <a href="/seoul/check/service-policy/">불법·선정적 서비스 불가 안내</a>에 정리되어 있습니다.</p>';

/* ================================================================== */
/* MAIN PAGE                                                            */
/* ================================================================== */
function main() {
  const areaCards = reg.AREAS.map((a) => ({
    name: a.name,
    href: `/seoul/area/${a.slug}/`,
    meta: `${a.gu.length}개 구`,
  }));
  const programCards = reg.PROGRAMS.map((p) => ({
    name: p.name,
    href: `/seoul/program/${p.slug}/`,
    meta: p.short,
  }));
  const guCards = reg.GU.map((g) => ({ name: g.name, href: `/seoul/${g.slug}/` }));
  const useCards = reg.USE.slice(0, 8).map((u) => ({
    name: u.name,
    href: `/seoul/use/${u.slug}/`,
  }));

  const mainFaqs = [
    { q: "서울 전 지역 방문이 가능한가요?", a: "실제 방문 주소, 가까운 생활권, 예약 가능 시간, 이동 기준을 확인한 뒤 안내합니다." },
    { q: "서울은 구별로 찾는 것이 좋나요, 생활권으로 찾는 것이 좋나요?", a: "같은 구 안에서도 업무지구·주거지·숙소 인접권이 다르므로 구와 생활권을 함께 확인하는 것이 좋습니다." },
    { q: "마사지 프로그램은 어떻게 선택하나요?", a: "부드러운 릴렉스 관리, 스트레칭 중심 관리, 오일 사용 여부, 압 조절 필요 여부에 따라 선택 기준이 달라집니다." },
    { q: "호텔이나 숙소에서도 이용할 수 있나요?", a: "숙소 정책, 객실 출입 가능 여부, 프런트 확인 방식, 예약자명, 야간 출입 가능 여부를 먼저 확인해야 합니다." },
    { q: "야간 예약은 무조건 가능한가요?", a: "무조건 가능하다고 안내하지 않습니다. 주소, 이동 거리, 건물 출입, 예약 가능 시간 확인 후 안내합니다." },
    { q: "불법·선정적 서비스도 가능한가요?", a: "불법·선정적 서비스는 제공하거나 안내하지 않습니다." },
    { q: "개인정보는 어떻게 처리하나요?", a: "예약 확인과 연락에 필요한 최소 정보만 확인하며, 개인정보 처리 기준 페이지로 연결합니다." },
  ];

  const body = `
  <section class="hero"><div class="container"><div class="hero__inner">
    <span class="eyebrow">서울 출장마사지 · 지역·프로그램 안내</span>
    <h1>서울 출장마사지<br>지역별 생활권과 마사지 프로그램 안내</h1>
    <p class="lead">강남, 잠실, 홍대, 여의도, 성수, 용산, 목동, 마곡 등 서울 주요 생활권과 스웨디시·아로마테라피·타이마사지·스포츠 마사지 등 프로그램별 예약 전 확인사항을 안내합니다.</p>
    <div class="hero__cta">
      <a class="btn btn--accent btn--lg" href="/seoul/area/gangnam-southeast/">강남권 보기</a>
      <a class="btn btn--ghost btn--lg" href="/seoul/program/">마사지 프로그램 보기</a>
      <a class="btn btn--ghost btn--lg" href="/seoul/use/hotel/">호텔·숙소 확인</a>
    </div>
    <div class="hero__badges">
      <span class="badge">상호 ${esc(SITE.brand)}</span>
      <span class="badge">전화 예약 ${esc(SITE.phone)}</span>
      <span class="badge">불법·선정적 서비스 불가</span>
    </div>
  </div></div></section>
  ${heroImageBand("서울 출장마사지 지역·프로그램 안내")}

  <section class="section--tight"><div class="container container--narrow"><div class="prose">
    ${byline()}
    <h2>서울 출장마사지, 지역과 프로그램을 함께 확인해야 합니다</h2>
    <p>서울은 25개 자치구와 400개가 넘는 행정동으로 이루어져 있지만, 실제 이용 기준은 행정구역만으로 정해지지 않습니다. 같은 강남구 안에서도 테헤란로 오피스 밀집지, 압구정·청담의 고급 상권, 역삼·논현의 오피스텔 벨트는 건물 출입 방식과 이동 동선이 서로 다릅니다. 잠실의 대단지 아파트, 여의도의 금융 사옥, 성수의 준공업 개조 건물, 홍대의 게스트하우스도 방문 전 확인해야 할 항목이 제각각입니다. <strong>간다GO</strong>는 이런 차이를 지역별·생활권별로 정리해, 방문 전 위치와 건물 유형, 예약 가능 시간, 이용하려는 관리 유형을 한 번에 확인할 수 있도록 안내합니다.</p>
    <p>마사지 프로그램도 목적에 따라 선택 기준이 다릅니다. 부드러운 릴렉스를 원하면 <a href="/seoul/program/swedish/">스웨디시</a>나 <a href="/seoul/program/aroma-therapy/">아로마테라피</a>, 근육 피로가 크면 <a href="/seoul/program/sports-massage/">스포츠 마사지</a>·<a href="/seoul/program/deep-tissue/">딥티슈</a>, 스트레칭 중심이면 <a href="/seoul/program/thai-massage/">타이마사지</a>, 장시간 보행 후에는 <a href="/seoul/program/foot-massage/">발마사지</a>가 기준이 됩니다. 오일 사용 여부와 압의 강도, 공간 확보가 필요한지도 예약 시 함께 확인하면 좋습니다.</p>

    <h2>서울 출장마사지 이용 가이드 — 예약 전 4단계</h2>
    <p>처음 방문형 관리를 이용한다면 아래 순서로 확인하면 대기 없이 안내받을 수 있습니다. 첫째, <a href="/seoul/check/address/">방문 주소</a>를 도로명 기준으로 정확히 확인합니다. 둘째, 자택·<a href="/seoul/use/hotel/">호텔</a>·<a href="/seoul/use/officetel/">오피스텔</a>·<a href="/seoul/use/apartment/">아파트</a> 등 이용 장소에 따라 공동현관·엘리베이터·경비실 <a href="/seoul/check/building-access/">출입 방식</a>을 확인합니다. 셋째, 원하는 마사지 프로그램과 코스(60·90·120분)를 정합니다. 넷째, <a href="/seoul/check/time/">예약 가능 시간</a>과 <a href="/seoul/check/change-policy/">변경 기준</a>을 확인합니다. 야간 이용은 무조건 가능하다고 안내하지 않으며, 주소와 이동 거리, 건물 출입 조건을 확인한 뒤 안내됩니다.</p>

    <h2>간다GO가 정보를 만드는 방식</h2>
    <p>간다GO는 서울지역 방문형 웰니스 서비스의 <strong>예약 전 확인 정보</strong>를 정리하는 안내 사이트입니다. 서울시 자치구·행정동 구조와 주요 생활권, 역세권, 실제 예약 전 확인 항목을 바탕으로 페이지를 구성하고, 최종 문구는 사람이 검수해 중복·과장·허위 표현을 제거합니다. 실제 후기가 없는 별점·리뷰, 오프라인 매장이 없는 지역 표기, 사용자에게 보이지 않는 구조화 데이터는 사용하지 않습니다. 표시된 프로그램은 모두 관리 유형에 대한 안내이며, 불법·선정적 서비스는 제공하거나 암시하지 않습니다. 운영·검수 기준은 <a href="/seoul/about/">운영 기준</a> 페이지에서, 처리 정보는 <a href="/seoul/check/privacy/">개인정보 처리 기준</a>에서 확인할 수 있습니다.</p>
  </div></div></section>

  <section class="section--tight"><div class="container">
    ${sectionHead("생활권", "서울 5대 생활권 안내", "권역을 선택하면 해당 자치구와 주요 생활권으로 이동합니다.")}
    <div class="grid grid--3">
      ${areaCards
        .map(
          (a) =>
            `<a class="card" href="${a.href}"><div class="card__title">${esc(a.name)}</div><p class="card__body">${esc(a.meta)} · 생활권·역세권 안내</p></a>`
        )
        .join("")}
    </div>
  </div></section>

  <section class="section--tight"><div class="container">
    ${sectionHead("프로그램", "서울 마사지 프로그램 안내", "관리 유형별 특징과 예약 전 확인사항을 안내합니다.")}
    ${linkCards(programCards)}
  </div></section>

  <section id="gu" class="section--tight"><div class="container">
    ${sectionHead("구별 안내", "서울 25개 구 안내")}
    ${linkCards(guCards)}
  </div></section>

  <section class="section--tight"><div class="container">
    ${sectionHead("이용 장소", "이용 장소별 확인 기준")}
    ${linkCards(useCards)}
  </div></section>

  ${priceSection()}

  <section class="section--tight"><div class="container container--narrow">
    ${sectionHead("체크리스트", "예약 전 확인해야 할 내용")}
    ${checklist([
      "방문 주소를 정확히 확인했나요?",
      "서울 어느 생활권인지 확인했나요?",
      "이용하려는 프로그램을 확인했나요?",
      "호텔·숙소 이용 가능 여부를 확인했나요?",
      "오피스텔 공동현관과 관리 규정을 확인했나요?",
      "아파트 단지 출입 방식을 확인했나요?",
      "예약 가능 시간과 변경 기준을 확인했나요?",
      "개인정보 처리 기준을 확인했나요?",
      "불법·선정적 서비스 불가 안내를 확인했나요?",
    ])}
  </div></section>

  <section class="section--tight"><div class="container container--narrow">
    ${sectionHead("자주 묻는 질문", "서울 출장마사지 FAQ")}
    ${faqBlock(mainFaqs)}
  </div></section>

  <section class="section--tight"><div class="container container--narrow"><div class="prose">
    <h2>Who, How, Why</h2>
    ${whwBlock({
      who: "이 콘텐츠는 서울지역 방문형 웰니스 서비스 이용 전, 사용자가 위치·건물 출입·숙소 정책·예약 기준을 확인할 수 있도록 작성되었습니다. 서울 25개 구와 주요 생활권, 역세권, 이용 장소 기준을 바탕으로 페이지를 관리합니다.",
      how: "서울시 자치구·행정동 구조, 주요 생활권, 실제 예약 전 확인 항목, 개인정보 처리 기준, 불법·선정적 서비스 불가 원칙을 기준으로 작성합니다. AI 보조 도구를 사용할 수 있으나 최종 문구는 사람이 검수하고 중복·과장·허위 표현을 제거합니다.",
      why: "이 페이지의 목적은 검색 순위 조작이 아니라, 서울에서 자택·호텔·오피스텔·업무지구 이용 전 필요한 확인사항을 쉽게 안내하는 것입니다. 제공하지 않는 서비스나 불법·선정적 내용을 암시하지 않습니다.",
    })}
    ${POLICY_NOTICE}
  </div></div></section>`;

  return {
    path: "/",
    title: "서울 출장마사지｜강남·잠실·홍대·여의도 홈타이·마사지 프로그램 안내",
    description: descClamp(
      "서울 출장마사지·홈타이 예약 전 강남·잠실·홍대·여의도 생활권과 스웨디시·아로마·타이 프로그램을 안내합니다."
    ),
    breadcrumb: null,
    faqs: mainFaqs,
    mobileBar: true,
    body,
  };
}

/* ================================================================== */
/* PROGRAM MAIN + DETAILS                                               */
/* ================================================================== */
function programMain() {
  const cards = reg.PROGRAMS.map((p) => ({
    name: p.name,
    href: `/seoul/program/${p.slug}/`,
    meta: p.short,
  }));
  const body =
    regionHero(
      "마사지 프로그램",
      "서울 마사지 프로그램 · 관리 유형별 예약 전 확인사항",
      "스웨디시·아로마테라피·타이마사지·스포츠 마사지·발마사지·딥티슈·로미로미·커플 관리의 특징과 이용 전 확인사항을 안내합니다.",
      [{ label: "예약 전 확인", href: "/seoul/check/address/", accent: true }]
    ) +
    `<section class="section--tight"><div class="container">
      ${sectionHead("프로그램", "관리 유형별 안내")}
      ${linkCards(cards)}
    </div></section>` +
    proseWrap(
      `<h2>프로그램은 목적에 따라 선택합니다</h2>
      <p>같은 시간대라도 목적에 따라 적합한 관리 유형이 다릅니다. 부드러운 릴렉스가 목적이면 스웨디시나 아로마테라피, 뻐근함·근육 피로가 크면 스포츠 마사지나 딥티슈, 스트레칭 중심이면 타이마사지, 장시간 보행 후에는 발마사지가 선택 기준이 됩니다. 오일 사용 여부, 압의 강도, 공간 확보 필요 여부는 예약 시 함께 확인하면 좋습니다.</p>
      ${PRIVACY_H2}${SERVICE_H2}${POLICY_NOTICE}`
    );

  return {
    path: "/seoul/program/",
    title: "서울 마사지 프로그램 안내｜스웨디시·아로마·타이·스포츠 관리 기준",
    description: descClamp(
      "서울 마사지 프로그램 예약 전 스웨디시·아로마·타이·스포츠·발마사지 등 관리 유형별 확인사항을 안내합니다."
    ),
    breadcrumb: [HOME, { name: "마사지 프로그램", href: "/seoul/program/" }],
    body,
  };
}

// program → region internal links (per brief §18)
const PROGRAM_REGIONS = {
  swedish: ["gangnam-yeoksam", "hongdae-hapjeong", "seongsu-wangsimni", "yongsan-seoul-station"],
  "thai-massage": ["sillim-seoul-univ", "nowon-sanggye", "kondae-gwangjin", "mokdong-yangcheon"],
  "aroma-therapy": ["gangnam-yeoksam", "myeongdong-euljiro", "hongdae-hapjeong", "yeouido-yeongdeungpo", "yongsan-seoul-station"],
  "sports-massage": ["yeouido-yeongdeungpo", "gudi-gadi", "magok-balsan", "jamsil-songpa"],
  "foot-massage": ["myeongdong-euljiro", "yongsan-seoul-station", "hongdae-hapjeong", "gangnam-yeoksam"],
  "deep-tissue": ["gangnam-yeoksam", "yeouido-yeongdeungpo", "seongsu-wangsimni"],
  "lomi-lomi": ["hongdae-hapjeong", "hannam-itaewon", "cheongdam-apgujeong"],
  couple: ["cheongdam-apgujeong", "jamsil-songpa", "hannam-itaewon"],
  night: ["gangnam-yeoksam", "hongdae-hapjeong", "jongno-gwanghwamun"],
  men: ["yeouido-yeongdeungpo", "gudi-gadi", "gangnam-yeoksam"],
  women: ["gangnam-yeoksam", "mokdong-yangcheon", "hongdae-hapjeong"],
};

// distinctive body content per program
const PROGRAM_BODY = {
  swedish: {
    intro: "스웨디시는 오일을 사용해 부드럽고 일정한 압으로 전신을 쓸어내리는 방식의 릴렉스 중심 관리입니다. 강한 자극보다는 순환과 이완에 초점을 두기 때문에 처음 방문형 관리를 이용하는 분, 잔잔한 휴식을 원하는 분에게 선택 기준이 됩니다.",
    care: "압 강도는 예약 시 조절 가능 여부를 확인하고, 오일 사용을 원하지 않으면 미리 알려야 합니다. 오피스텔·숙소에서는 수건과 시트 준비 여부, 샤워 가능 여부를 확인하면 이용이 매끄럽습니다.",
    caution: "오일 알레르기나 피부 민감이 있으면 예약 시 반드시 알려야 하며, 음주 직후나 컨디션이 크게 저하된 상태에서는 무리한 관리를 피하는 것이 좋습니다.",
  },
  "thai-massage": {
    intro: "타이마사지는 오일을 거의 사용하지 않고 스트레칭과 지압을 결합해 전신을 풀어주는 관리입니다. 몸을 눕히거나 접는 동작이 많아 어느 정도의 공간 확보와 편한 복장이 필요합니다.",
    care: "매트를 펼칠 수 있는 바닥 공간이 필요하므로 자택·아파트 이용이 비교적 수월하고, 좁은 객실에서는 동작이 제한될 수 있어 예약 시 공간을 확인하는 것이 좋습니다.",
    caution: "허리·무릎·목 디스크 등 관절 이력이 있으면 예약 시 알려 스트레칭 강도를 조절해야 하며, 임신 중이거나 최근 수술 이력이 있으면 이용 전 상담이 필요합니다.",
  },
  "aroma-therapy": {
    intro: "아로마테라피는 향이 있는 오일을 사용해 후각과 촉각을 함께 이완시키는 관리입니다. 릴렉스와 함께 향의 만족도가 중요하기 때문에 선호하는 향이나 민감한 향을 예약 시 확인하면 좋습니다.",
    care: "호텔·오피스텔에서는 환기 여부와 향에 대한 주변 민감도를 고려하고, 피부가 민감하면 오일 종류를 미리 확인해야 합니다.",
    caution: "향·오일 알레르기, 비염·천식 등 호흡기 민감이 있으면 예약 시 알려야 하며, 임신 중에는 사용 가능한 오일이 제한될 수 있어 사전 확인이 필요합니다.",
  },
  "sports-massage": {
    intro: "스포츠 마사지는 운동 후 뭉친 근육과 특정 부위의 피로를 압 조절을 통해 관리하는 방식입니다. 전신 릴렉스보다는 부위별 이완과 회복에 초점을 둡니다.",
    care: "관리를 원하는 부위(허벅지, 종아리, 어깨, 등 등)를 예약 시 구체적으로 알리면 시간 배분이 정확해집니다. 업무지구·오피스텔 이용이 많아 퇴근 후 시간대 예약이 몰릴 수 있습니다.",
    caution: "부상 직후, 염증·부종이 있는 부위는 무리한 압을 피해야 하며, 통증이 심하면 관리보다 진료가 우선입니다. 압은 참는 것이 아니라 조절하는 것이 기준입니다.",
  },
  "foot-massage": {
    intro: "발마사지는 발과 종아리를 중심으로 순환과 피로를 관리하는 방식으로, 장시간 보행·서서 근무·여행 이동이 많은 경우에 선택 기준이 됩니다.",
    care: "관광 숙소나 호텔에서 여행 일정 사이에 이용하는 경우가 많아, 짧은 시간에도 이용이 가능한지 예약 시 확인하면 좋습니다.",
    caution: "발에 상처·무좀·염증이 있으면 예약 시 알려야 하며, 하지정맥류나 부종이 심한 경우 압 강도 조절이 필요합니다.",
  },
  "deep-tissue": {
    intro: "딥티슈는 표면보다 깊은 근막층을 겨냥해 만성적으로 뭉친 부위를 집중 관리하는 방식입니다. 압이 상대적으로 강하기 때문에 이완보다 회복이 목적일 때 적합합니다.",
    care: "강한 압을 원하지 않는 분은 예약 시 강도를 낮춰달라고 요청하고, 집중 부위를 미리 정하면 만족도가 높습니다.",
    caution: "혈압 이상, 혈전·염증 이력, 최근 수술 부위가 있으면 이용 전 상담이 필요하며, 관리 후 근육통이 하루 정도 남을 수 있습니다.",
  },
  "lomi-lomi": {
    intro: "로미로미는 팔 전체를 이용한 리듬감 있는 오일 관리로, 물결처럼 이어지는 동작으로 전신을 부드럽게 이완시키는 하와이식 관리입니다. 정적인 관리보다 흐르는 리듬을 선호하는 분에게 선택 기준이 됩니다.",
    care: "오일 사용량이 많아 시트·수건 준비와 샤워 가능 여부를 확인하면 좋고, 향이 있는 오일을 사용할 경우 환기를 고려합니다.",
    caution: "오일 알레르기, 피부 민감, 향 민감이 있으면 예약 시 알려야 하며, 임신 중이면 사전 상담이 필요합니다.",
  },
  couple: {
    intro: "커플 관리는 두 사람이 같은 공간에서 동시에 관리를 받는 방식으로, 인원수만큼의 공간과 준비가 필요합니다.",
    care: "동시 진행을 위해 관리사 인원, 예약 시간, 공간 크기를 예약 시 확인해야 하며, 호텔·숙소는 2인 방문 정책을 별도로 확인해야 합니다.",
    caution: "각자의 선호 프로그램과 압 강도가 다를 수 있으므로 예약 시 개별로 안내하면 좋고, 숙소 정책상 2인 이상 방문이 제한되는 경우가 있어 사전 확인이 필요합니다.",
  },
  night: {
    intro: "야간 예약은 늦은 시간대 이용을 위한 안내입니다. ‘24시간 무조건 가능’과 같은 방식으로 안내하지 않으며, 주소·건물 출입·이동 거리·예약 가능 시간을 확인한 뒤 안내합니다.",
    care: "야간에는 공동현관·엘리베이터·경비실 출입 방식이 낮과 다를 수 있어 <a href=\"/seoul/check/night-access/\">야간 출입 확인</a>을 함께 참고하면 좋습니다.",
    caution: "야간 이동은 거리와 시간대에 따라 안내가 달라질 수 있으며, 무리한 심야 이동은 안전을 우선해 조정될 수 있습니다.",
  },
  men: {
    intro: "남성 고객 안내는 남성 이용자가 예약 전 확인하면 좋은 기준을 정리한 페이지입니다. 프로그램 선택과 압 강도, 이용 장소 기준은 공통 안내와 동일하게 적용됩니다.",
    care: "업무 피로·운동 후 회복이 목적이면 스포츠 마사지나 딥티슈, 전신 이완이 목적이면 스웨디시가 선택 기준이 됩니다.",
    caution: "이 사이트는 불법·선정적 서비스를 제공하거나 안내하지 않으며, 모든 이용은 건전한 웰니스 기준으로만 안내됩니다.",
  },
  women: {
    intro: "여성 고객 안내는 여성 이용자가 예약 전 확인하면 좋은 기준을 정리한 페이지입니다. 방문 시 안전과 출입 방식, 프로그램 선택 기준을 함께 확인할 수 있습니다.",
    care: "향·오일 민감 여부, 선호하는 압 강도를 예약 시 알리면 좋고, 자택·오피스텔 이용 시 공동현관과 방문 시간대를 확인하면 안심하고 이용할 수 있습니다.",
    caution: "이 사이트는 불법·선정적 서비스를 제공하거나 안내하지 않으며, 방문 안전과 관련한 확인사항을 우선으로 안내합니다.",
  },
};

function program(pr) {
  const b = PROGRAM_BODY[pr.slug];
  const regions = (PROGRAM_REGIONS[pr.slug] || []).map((s) => ({
    name: maps.life[s].name,
    href: `/seoul/life/${s}/`,
  }));
  const inner = `
    <h2>${pr.name}란</h2><p>${b.intro}</p>
    <h2>이용 전 확인사항</h2><p>${b.care}</p>
    <h2>이런 점에 주의하세요</h2><p>${b.caution}</p>
    <h2>${pr.name} 이용이 많은 서울 생활권</h2>
    <p>아래 생활권에서 ${pr.name} 문의가 잦습니다. 지역 페이지에서 이동 기준과 이용 장소 확인사항을 함께 확인할 수 있습니다.</p>
    ${relatedChips(regions)}
    <h2>예약 전 체크리스트</h2>
    ${checklist([
      `${pr.name}의 압 강도와 오일 사용 여부를 확인했나요?`,
      "방문 주소와 건물 출입 방식을 확인했나요?",
      "이용 장소(자택·호텔·오피스텔)의 준비 사항을 확인했나요?",
      "예약 가능 시간과 변경 기준을 확인했나요?",
    ])}
    ${PRIVACY_H2}${SERVICE_H2}${POLICY_NOTICE}
    <h2>자주 묻는 질문</h2>
    ${faqBlock([
      { q: `${pr.name}는 어떤 분에게 맞나요?`, a: b.intro },
      { q: "이용 장소는 어디든 가능한가요?", a: "자택·호텔·오피스텔 등 이용 장소에 따라 준비 사항이 다르므로 예약 전 이용 장소 페이지를 확인하는 것이 좋습니다." },
      { q: "야간에도 이용할 수 있나요?", a: "무조건 가능하다고 안내하지 않습니다. 주소·이동 거리·건물 출입·예약 가능 시간 확인 후 안내합니다." },
    ])}`;

  return {
    path: `/seoul/program/${pr.slug}/`,
    title: `서울 ${pr.name}｜특징·이용 전 확인사항·생활권 안내`,
    description: descClamp(
      `서울 ${pr.name} 예약 전 특징과 압·오일 확인, 이용 장소 기준과 문의가 많은 생활권을 안내합니다.`
    ),
    breadcrumb: [
      HOME,
      { name: "마사지 프로그램", href: "/seoul/program/" },
      { name: pr.name, href: `/seoul/program/${pr.slug}/` },
    ],
    faqs: [
      { q: `${pr.name}는 어떤 분에게 맞나요?`, a: b.intro },
      { q: "야간에도 이용할 수 있나요?", a: "무조건 가능하다고 안내하지 않습니다. 주소·이동 거리·건물 출입·예약 가능 시간 확인 후 안내합니다." },
    ],
    body: regionHero(
      "마사지 프로그램",
      `서울 ${pr.name} 안내`,
      pr.short + " · 예약 전 특징과 확인사항을 안내합니다.",
      [
        { label: "다른 프로그램 보기", href: "/seoul/program/", accent: true },
        { label: "예약 전 확인", href: "/seoul/check/address/" },
      ]
    ) + proseWrap(inner),
  };
}

/* ================================================================== */
/* USE PAGES                                                            */
/* ================================================================== */
const USE_BODY = {
  home: ["자택·방문 이용 시 가장 중요한 것은 정확한 주소입니다. 도로명 주소, 동·호수, 공동현관 출입 방식, 방문 가능 시간을 예약 시 확인하면 대기 없이 안내받을 수 있습니다.", "단독주택·빌라·원룸은 공동현관 유무와 주차 가능 여부가 다르므로 <a href=\"/seoul/check/address/\">주소 확인</a>과 <a href=\"/seoul/check/building-access/\">건물 출입</a> 기준을 함께 확인하세요."],
  hotel: ["호텔·숙소 이용 시에는 객실 방문이 가능한지, 프런트를 통한 확인이 필요한지, 예약자명이 일치하는지, 야간 출입이 가능한지를 먼저 확인해야 합니다.", "숙소마다 외부 방문 정책이 다르므로 <a href=\"/seoul/check/hotel-policy/\">호텔 정책 확인</a>을 예약 전에 참고하는 것이 좋습니다."],
  officetel: ["오피스텔은 공동현관 비밀번호, 엘리베이터 카드, 경비실 확인, 방문 가능 시간대 등 관리 규정을 확인해야 합니다.", "건물마다 규정이 다르므로 <a href=\"/seoul/check/officetel-rule/\">오피스텔 규정</a>을 확인하고, 야간에는 <a href=\"/seoul/check/night-access/\">야간 출입</a> 기준도 함께 확인하세요."],
  apartment: ["아파트·단지는 방문 차량 등록, 공동현관 호출, 동·호수 확인이 필요한 경우가 많습니다. 단지 규모에 따라 출입 절차가 달라집니다.", "예약 전 <a href=\"/seoul/check/apartment-access/\">아파트 출입 기준</a>과 <a href=\"/seoul/check/parking/\">주차 확인</a>을 참고하면 방문이 매끄럽습니다."],
  "business-district": ["업무지구는 퇴근 이후 시간대에 예약이 몰리는 편입니다. 오피스텔·사무실·인근 숙소 중 어디에서 이용하는지에 따라 출입 방식이 달라집니다.", "예약 가능 시간과 건물 출입 방식을 미리 확인하면 대기 없이 안내받을 수 있습니다. 여의도·구디·가디·마곡 등 업무지구 생활권 페이지를 함께 참고하세요."],
  "station-area": ["역세권은 이동 거리가 짧아 접근이 수월하지만, 실제 방문 위치는 역이 아니라 정확한 주소 기준으로 안내됩니다.", "출구 번호보다 도로명 주소와 건물 유형을 확인하는 것이 정확하며, 역세권 페이지에서 생활권별 이동 기준을 확인할 수 있습니다."],
  "tour-accommodation": ["관광 숙소는 명동·홍대·이태원 등에 밀집해 있으며, 외국인 이용자와 게스트하우스·호텔이 혼재합니다. 숙소 방문 정책과 예약자명 확인이 특히 중요합니다.", "체크인 이후 시간대에 이용이 몰릴 수 있으므로 예약 가능 시간과 <a href=\"/seoul/check/hotel-policy/\">숙소 정책</a>을 미리 확인하세요."],
  night: ["야간 이용은 ‘무조건 가능’으로 안내하지 않습니다. 주소, 이동 거리, 건물 출입 방식, 예약 가능 시간을 확인한 뒤 안내합니다.", "야간에는 공동현관·엘리베이터·경비실 출입 절차가 낮과 다를 수 있어 <a href=\"/seoul/check/night-access/\">야간 출입 확인</a>을 함께 참고하세요."],
  "outer-area": ["서울 외곽 지역은 이동 거리와 시간대에 따라 안내가 달라질 수 있습니다. 방문 주소와 가까운 생활권, 예상 이동 시간을 미리 확인하면 좋습니다.", "외곽 이동은 안전과 이동 여건을 우선으로 조정될 수 있으며, 무리한 심야 장거리 이동은 조율될 수 있습니다."],
};

function use(u) {
  const inner = `
    ${P(USE_BODY[u.slug])}
    <h2>예약 전 체크리스트</h2>
    ${checklist([
      "정확한 방문 주소를 확인했나요?",
      `${u.name} 이용 시 출입 방식을 확인했나요?`,
      "예약 가능 시간과 변경 기준을 확인했나요?",
      "이용하려는 마사지 프로그램을 확인했나요?",
    ])}
    ${PRIVACY_H2}${SERVICE_H2}${POLICY_NOTICE}
    <h2>관련 확인 페이지</h2>
    ${relatedChips([
      { name: "주소 확인", href: "/seoul/check/address/" },
      { name: "건물 출입", href: "/seoul/check/building-access/" },
      { name: "예약 시간", href: "/seoul/check/time/" },
      { name: "마사지 프로그램", href: "/seoul/program/" },
    ])}`;

  return {
    path: `/seoul/use/${u.slug}/`,
    title: `${u.h1}｜서울 출장마사지 이용 안내`,
    description: descClamp(
      `서울 ${u.name} 출장마사지 예약 전 출입 방식, 예약 시간, 이용 기준과 확인사항을 안내합니다.`
    ),
    breadcrumb: [HOME, { name: "이용 장소", href: "/seoul/use/home/" }, { name: u.name, href: `/seoul/use/${u.slug}/` }],
    body: regionHero("이용 장소", u.h1, `${u.name} 이용 전 확인사항을 안내합니다.`, [
      { label: "예약 전 확인", href: "/seoul/check/address/", accent: true },
      { label: "마사지 프로그램", href: "/seoul/program/" },
    ]) + proseWrap(inner),
  };
}

/* ================================================================== */
/* CHECK PAGES                                                          */
/* ================================================================== */
const CHECK_BODY = {
  address: ["방문 주소는 모든 안내의 출발점입니다. 도로명 주소와 건물명, 동·호수, 공동현관 위치를 정확히 확인하면 방문이 지연되지 않습니다.", "지도 앱의 위치와 실제 출입구가 다른 경우가 있으므로, 예약 시 건물 정문 기준 위치를 함께 알려주면 좋습니다."],
  "building-access": ["건물 출입 방식은 공동현관 비밀번호, 호출, 카드, 경비실 확인 등으로 나뉩니다. 방문 전 어떤 방식인지 확인하면 대기 시간을 줄일 수 있습니다.", "오피스텔·아파트·호텔은 출입 절차가 다르므로 해당 이용 장소 페이지를 함께 참고하세요."],
  "apartment-access": ["아파트 단지는 방문 차량 등록, 공동현관 호출, 동·호수 확인이 필요한 경우가 많습니다. 대단지는 정문·후문 위치도 확인하면 좋습니다.", "방문 차량이 있는 경우 <a href=\"/seoul/check/parking/\">주차 확인</a>을 함께 참고하세요."],
  "hotel-policy": ["호텔·숙소는 외부 방문 정책이 제각각입니다. 객실 방문 가능 여부, 프런트 확인 필요 여부, 예약자명 일치, 야간 출입 가능 여부를 확인해야 합니다.", "정책 확인이 어려운 경우 프런트에 외부 방문 가능 여부를 먼저 문의하는 것이 안전합니다."],
  "officetel-rule": ["오피스텔은 관리 규정에 따라 방문 절차가 다릅니다. 공동현관, 엘리베이터 카드, 경비실 확인, 방문 가능 시간대를 확인하세요.", "야간에는 출입 절차가 강화되는 경우가 있어 <a href=\"/seoul/check/night-access/\">야간 출입</a> 기준을 함께 확인하면 좋습니다."],
  "business-district": ["업무지구는 퇴근 이후 시간대 예약이 몰립니다. 사무실·오피스텔·인근 숙소 중 이용 위치에 따라 출입 방식이 달라집니다.", "예약 가능 시간을 미리 확인하고, 건물 로비·경비실 출입 절차를 함께 확인하세요."],
  parking: ["방문 차량이 있는 경우 주차 가능 여부, 방문 차량 등록 절차, 주차 요금을 확인하면 좋습니다.", "단지형 아파트·오피스텔은 방문 차량 등록이 필요한 경우가 많으므로 예약 시 함께 안내하면 좋습니다."],
  "night-access": ["야간에는 공동현관·엘리베이터·경비실 출입 절차가 낮과 다를 수 있습니다. 야간 방문 가능 시간과 출입 방식을 확인하세요.", "야간 이용은 ‘무조건 가능’으로 안내하지 않으며, 주소와 이동 거리, 예약 가능 시간을 확인한 뒤 안내합니다."],
  time: ["예약 가능 시간은 지역, 이동 거리, 시간대에 따라 달라집니다. 원하는 시간대를 미리 알리면 안내가 정확해집니다.", "요금은 코스(60·90·120분) 기준이며, 지역·예약 시간대·이동 거리에 따라 상담 시 최종 확인됩니다."],
  "change-policy": ["예약 변경·취소는 가능한 한 빨리 알려주는 것이 좋습니다. 방문 준비와 이동이 시작되기 전에 알리면 조율이 수월합니다.", "변경 기준은 상담 시 안내되며, 무리한 심야 변경은 이동 여건에 따라 조정될 수 있습니다."],
  privacy: ["예약 확인과 연락에 필요한 최소 정보만 확인하며, 목적이 끝난 정보는 보관하지 않는 것을 원칙으로 합니다.", "이 사이트는 예약 상담을 위한 정보 안내를 목적으로 하며, 확인된 개인정보를 제3자에게 제공하거나 목적 외로 사용하지 않습니다."],
  "service-policy": ["이 사이트는 방문형 웰니스 정보 안내를 목적으로 하며, 불법·선정적 서비스는 제공하거나 안내하지 않습니다.", "모든 관리는 건전한 웰니스 기준으로만 안내되며, 선정적·불법적 요청은 응대하지 않습니다. 표시된 프로그램은 모두 관리 유형에 대한 안내입니다."],
  "customer-notice": ["고객 이용 안내는 예약 전 알아두면 좋은 공통 기준을 정리한 페이지입니다. 주소 확인, 건물 출입, 예약 시간, 프로그램 선택 순으로 확인하면 이용이 매끄럽습니다.", "이용 중 불편이나 변경 사항이 있으면 상담을 통해 조율할 수 있으며, 안전과 관련한 확인사항이 우선됩니다."],
};

function check(c) {
  const inner = `
    ${P(CHECK_BODY[c.slug])}
    <h2>확인 순서</h2>
    ${checklist([
      "방문 주소와 건물 유형을 확인했나요?",
      `${c.name} 관련 절차를 확인했나요?`,
      "예약 가능 시간과 변경 기준을 확인했나요?",
      "불법·선정적 서비스 불가 안내를 확인했나요?",
    ])}
    ${POLICY_NOTICE}
    <h2>관련 페이지</h2>
    ${relatedChips([
      { name: "주소 확인", href: "/seoul/check/address/" },
      { name: "호텔 정책", href: "/seoul/check/hotel-policy/" },
      { name: "오피스텔 규정", href: "/seoul/check/officetel-rule/" },
      { name: "개인정보", href: "/seoul/check/privacy/" },
      { name: "불법·선정적 서비스 불가", href: "/seoul/check/service-policy/" },
    ])}`;

  return {
    path: `/seoul/check/${c.slug}/`,
    title: `서울 출장마사지 ${c.h1}｜예약 전 확인`,
    description: descClamp(
      `서울 출장마사지 예약 전 ${c.name} 관련 확인 절차와 기준을 안내합니다. 방문 전 참고하세요.`
    ),
    breadcrumb: [HOME, { name: "예약 전 확인", href: "/seoul/check/address/" }, { name: c.name, href: `/seoul/check/${c.slug}/` }],
    body: regionHero("예약 전 확인", `서울 출장마사지 ${c.h1}`, `${c.name} 관련 확인 절차를 안내합니다.`, [
      { label: "이용 장소 보기", href: "/seoul/use/home/", accent: true },
      { label: "문의하기", href: "/seoul/contact/" },
    ]) + proseWrap(inner),
  };
}

/* ================================================================== */
/* CONTACT / ABOUT / SITEMAP / ROOT                                     */
/* ================================================================== */
function contact() {
  const inner = `
    <h2>전화 예약</h2>
    <p>가장 빠른 예약·문의 방법은 전화입니다. 방문 주소, 가까운 생활권, 원하는 프로그램과 시간대를 알려주시면 안내가 정확해집니다.</p>
    <p><a class="btn btn--accent btn--lg" href="${SITE.phoneHref}">${ICONS.phone} 전화 예약 ${esc(SITE.phone)}</a></p>
    <h2>제휴·제작 문의</h2>
    <p>제휴 문의와 웹사이트 제작 문의는 텔레그램으로 받고 있습니다. 아래 버튼 또는 푸터의 오렌지 버튼을 이용하세요.</p>
    <p>
      <a class="btn btn--accent" href="${SITE.telegram.build}" target="_blank" rel="noopener nofollow">${ICONS.telegram} 웹사이트 제작문의</a>
      <a class="btn btn--accent" href="${SITE.telegram.partner}" target="_blank" rel="noopener nofollow">${ICONS.telegram} 제휴문의</a>
    </p>
    <h2>이용 안내</h2>
    <p>예약 전 <a href="/seoul/check/address/">주소 확인</a>, <a href="/seoul/use/hotel/">이용 장소</a>, <a href="/seoul/program/">마사지 프로그램</a> 페이지를 참고하면 상담이 빠릅니다.</p>
    ${POLICY_NOTICE}`;
  return {
    path: "/seoul/contact/",
    title: `${SITE.brand} 문의하기｜서울 출장마사지 전화 예약·제휴 문의`,
    description: descClamp(
      `서울 출장마사지 ${SITE.brand} 전화 예약 ${SITE.phone} 및 제휴·웹사이트 제작 문의 안내입니다.`
    ),
    breadcrumb: [HOME, { name: "문의하기", href: "/seoul/contact/" }],
    body: regionHero("문의하기", "간다GO 문의·예약 안내", `전화 예약 ${SITE.phone} · 제휴 및 제작 문의는 텔레그램으로 받습니다.`, [
      { label: `전화 예약 ${SITE.phone}`, href: SITE.phoneHref, accent: true },
    ]) + proseWrap(inner),
  };
}

function about() {
  const inner = `
    <h2>운영·작성 기준</h2>
    <p>이 사이트는 서울지역 방문형 웰니스 서비스의 이용 전 확인사항을 안내하는 정보 사이트입니다. 지역·생활권·역세권 구조와 마사지 프로그램, 이용 장소, 예약 전 확인 항목을 사람이 검수해 정리합니다.</p>
    <h2>작성 방식</h2>
    <p>서울시 자치구·행정동 구조와 주요 생활권을 기준으로 페이지를 구성하며, 실제 예약 전 확인 항목과 개인정보 처리 기준, 불법·선정적 서비스 불가 원칙을 반영합니다. AI 보조 도구를 사용할 수 있으나 최종 문구는 사람이 검수하고 중복·과장·허위 표현을 제거합니다.</p>
    <h2>신뢰 기준</h2>
    <p>실제 후기가 없는 별점·리뷰, 오프라인 매장이 없는 지역 표기, 사용자에게 보이지 않는 구조화 데이터는 사용하지 않습니다. 표시된 프로그램은 관리 유형에 대한 안내이며, 선정적·불법적 표현을 포함하지 않습니다.</p>
    <h2>연락처</h2>
    <p>상호: <strong>${esc(SITE.brand)}</strong> · 전화 예약: <a class="text-accent" href="${SITE.phoneHref}">${esc(SITE.phone)}</a></p>
    ${POLICY_NOTICE}`;
  return {
    path: "/seoul/about/",
    title: `${SITE.brand} 운영 기준·작성 방식 안내｜서울 출장마사지 정보`,
    description: descClamp(
      `${SITE.brand} 운영·작성·검수 기준과 신뢰 원칙, 연락처를 안내합니다. 사람이 검수하는 정보 사이트입니다.`
    ),
    breadcrumb: [HOME, { name: "운영 기준", href: "/seoul/about/" }],
    body: regionHero("운영 기준", "간다GO 운영·작성 기준", "누가·어떻게·왜 만드는지 공개합니다.", [
      { label: "문의하기", href: "/seoul/contact/", accent: true },
    ]) + proseWrap(inner),
  };
}

function sitemapPage() {
  const group = (title, items) =>
    `<h2>${esc(title)}</h2>${relatedChips(items)}`;
  const inner = [
    group("권역", reg.AREAS.map((a) => ({ name: a.name, href: `/seoul/area/${a.slug}/` }))),
    group("자치구", reg.GU.map((g) => ({ name: g.name, href: `/seoul/${g.slug}/` }))),
    group("생활권", reg.LIFEZONES.map((l) => ({ name: l.name, href: `/seoul/life/${l.slug}/` }))),
    group("역세권", reg.STATIONS.map((s) => ({ name: s.name, href: `/seoul/station/${s.slug}/` }))),
    group("마사지 프로그램", [{ name: "프로그램 전체", href: "/seoul/program/" }, ...reg.PROGRAMS.map((p) => ({ name: p.name, href: `/seoul/program/${p.slug}/` }))]),
    group("이용 장소", reg.USE.map((u) => ({ name: u.name, href: `/seoul/use/${u.slug}/` }))),
    group("예약 전 확인", reg.CHECK.map((c) => ({ name: c.name, href: `/seoul/check/${c.slug}/` }))),
    group("운영", [{ name: "문의하기", href: "/seoul/contact/" }, { name: "운영 기준", href: "/seoul/about/" }]),
  ].join("");
  return {
    path: "/seoul/sitemap/",
    title: `${SITE.brand} 사이트맵｜서울 출장마사지 전체 페이지 안내`,
    description: descClamp(
      "서울 출장마사지 정보 사이트의 권역·자치구·생활권·역세권·프로그램 전체 페이지를 한눈에 안내합니다."
    ),
    breadcrumb: [HOME, { name: "사이트맵", href: "/seoul/sitemap/" }],
    body: regionHero("사이트맵", "간다GO 사이트맵", "전체 페이지 구조를 한눈에 안내합니다.", []) + proseWrap(inner),
  };
}

function rootHub() {
  const inner = `
    <h2>서울 출장마사지 정보 안내</h2>
    <p>간다GO는 서울 25개 구와 주요 생활권, 역세권, 마사지 프로그램, 이용 장소별 예약 전 확인사항을 안내하는 정보 사이트입니다. 아래에서 원하는 안내로 이동하세요.</p>
    ${relatedChips([
      { name: "서울 메인", href: "/seoul/" },
      { name: "마사지 프로그램", href: "/seoul/program/" },
      { name: "이용 장소", href: "/seoul/use/home/" },
      { name: "예약 전 확인", href: "/seoul/check/address/" },
      { name: "문의하기", href: "/seoul/contact/" },
    ])}
    ${POLICY_NOTICE}`;
  return {
    path: "/",
    title: `${SITE.brand}｜서울 출장마사지·홈타이 지역·프로그램 안내`,
    description: descClamp(
      "간다GO 서울 출장마사지·홈타이 지역별 생활권과 마사지 프로그램 예약 전 확인 안내입니다."
    ),
    breadcrumb: null,
    body: regionHero("간다GO", "서울 출장마사지 · 지역·프로그램 안내", `전화 예약 ${SITE.phone} · 강남·잠실·홍대·여의도 등 서울 전 지역 안내`, [
      { label: "서울 메인 보기", href: "/seoul/", accent: true },
      { label: "마사지 프로그램", href: "/seoul/program/" },
    ]) + proseWrap(inner),
  };
}

module.exports = {
  main,
  programMain,
  program,
  use,
  check,
  contact,
  about,
  sitemapPage,
  rootHub,
};
