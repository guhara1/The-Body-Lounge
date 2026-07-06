"use strict";

/* Content accessor. Authored content lives in ../data/content/<type>.js as a
   map keyed by slug. When a slug has no authored entry we compose a
   differentiated fallback from the registry relationships + per-entity
   profile facts so the page is still substantive and unique (never a bare
   template). Authored content always wins. */

const path = require("path");
const { maps } = require("../data/registry");
const { PROFILES } = require("../data/profiles");

const fs = require("fs");

function tryLoad(name) {
  try {
    return require(path.join("..", "data", "content", name));
  } catch (e) {
    return {};
  }
}

/* Merge a single <name>.js file plus every .js in a <name>/ directory so
   content authoring can be split across multiple files without conflicts. */
function loadType(name) {
  let merged = { ...tryLoad(name) };
  const dir = path.join(__dirname, "..", "data", "content", name);
  try {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".js")) Object.assign(merged, require(path.join(dir, f)));
    }
  } catch (e) {
    /* no directory — fine */
  }
  return merged;
}

const authored = {
  gu: loadType("districts"),
  life: loadType("lifezones"),
  station: loadType("stations"),
  area: loadType("areas"),
};

/* Build program-link chips for an entity from its recommended program slugs */
function programChips(recSlugs) {
  return (recSlugs || ["swedish", "aroma-therapy", "sports-massage", "foot-massage"]).map(
    (s) => ({ name: maps.program[s].name, href: `/seoul/program/${s}/` })
  );
}

/* Fallback region content built from a profile. A profile supplies the
   distinctive facts (vibe, venue mix, stations, notes); prose weaves them
   into the required section structure. */
function fallbackRegion(type, entity) {
  const p = PROFILES[entity.slug] || {};
  const areaName = entity.area ? maps.area[entity.area].name : "서울";
  const vibe = p.vibe || `${entity.name}은(는) ${areaName}의 주요 생활권으로, 주거지와 상권, 업무 공간이 함께 자리합니다.`;
  const stations = p.stations || [];
  const stationTxt = stations.length
    ? stations.map((s) => `<strong>${s}</strong>`).join(", ")
    : "가까운 지하철역과 버스 노선";

  return {
    lifeFeature: [
      vibe,
      p.detail ||
        `같은 이름의 지역 안에서도 대로변 상권, 주거 단지, 오피스텔 밀집 구역이 나뉘므로 방문 전 정확한 위치를 먼저 확인하는 것이 좋습니다. ${entity.name} 이용 시에도 건물 유형에 따라 출입 방식이 달라집니다.`,
    ],
    access: [
      `${entity.name} 주변에서는 ${stationTxt} 이용이 잦습니다. ${p.access || "역과의 거리, 도보 이동 시간, 야간 이동 여부를 함께 확인하면 예약 시 안내가 정확해집니다."}`,
    ],
    hotel: [
      p.hotel ||
        `${entity.name} 인근 호텔·숙소를 이용할 경우 객실 출입 가능 여부, 프런트 확인 방식, 예약자명, 야간 출입 정책을 먼저 확인해야 합니다. 숙소마다 방문 정책이 다르므로 예약 전 <a href="/seoul/check/hotel-policy/">호텔 정책 확인</a>을 권장합니다.`,
    ],
    officetel: [
      p.officetel ||
        `오피스텔을 이용할 때는 공동현관 비밀번호, 엘리베이터 카드, 경비실 확인, 방문 가능 시간대를 확인해야 합니다. 관리 규정은 건물마다 다르므로 <a href="/seoul/check/officetel-rule/">오피스텔 규정</a>을 참고하세요.`,
    ],
    apartment: [
      p.apartment ||
        `아파트·자택 방문 시에는 동·호수, 공동현관 출입 방식, 주차 여부, 방문 가능 시간을 확인합니다. 단지형 아파트는 방문 차량 등록이 필요한 경우가 있어 <a href="/seoul/check/apartment-access/">아파트 출입 기준</a>을 함께 확인하면 좋습니다.`,
    ],
    business: [
      p.business ||
        `${entity.name}의 업무지구나 관광 숙소를 이용하는 경우, 퇴근 이후 시간대나 체크인 이후 시간대에 예약이 몰릴 수 있습니다. 방문 주소와 건물 출입 방식, 이동 거리를 미리 확인하면 대기 없이 안내받을 수 있습니다.`,
    ],
    programGuide: [
      p.programGuide ||
        `${entity.name}에서는 부드러운 릴렉스 관리를 원하면 스웨디시나 아로마테라피, 근육 피로가 크면 스포츠 마사지나 딥티슈, 장시간 보행 후에는 발마사지를 선택 기준으로 삼을 수 있습니다. 오일 사용 여부와 압 강도는 예약 시 함께 확인하세요.`,
    ],
    programLinks: programChips(p.programsRec),
    faqs:
      p.faqs || [
        {
          q: `${entity.name}도 방문이 가능한가요?`,
          a: "실제 방문 주소, 가까운 생활권, 예약 가능 시간, 이동 기준을 확인한 뒤 안내합니다.",
        },
        {
          q: "어떤 마사지 프로그램을 선택하면 좋나요?",
          a: "릴렉스 중심인지, 근육 이완 중심인지, 오일 사용 여부에 따라 선택 기준이 달라집니다.",
        },
        {
          q: "야간 예약도 가능한가요?",
          a: "무조건 가능하다고 안내하지 않습니다. 주소, 이동 거리, 건물 출입, 예약 가능 시간 확인 후 안내합니다.",
        },
      ],
    whw: p.whw || {
      who: `이 콘텐츠는 ${entity.name} 방문형 웰니스 서비스 이용 전, 위치·건물 출입·숙소 정책·예약 기준을 확인할 수 있도록 작성되었습니다.`,
      how: `${areaName}의 생활권 구조와 실제 예약 전 확인 항목, 개인정보 처리 기준, 불법·선정적 서비스 불가 원칙을 바탕으로 작성하며, 최종 문구는 사람이 검수합니다.`,
      why: `목적은 검색 순위 조작이 아니라, ${entity.name}에서 방문 전 필요한 확인사항을 쉽게 안내하는 것입니다. 제공하지 않는 서비스나 불법·선정적 내용을 암시하지 않습니다.`,
    },
    checklist: p.checklist,
  };
}

function getRegionContent(type, entity) {
  const src = authored[type] || {};
  return src[entity.slug] || fallbackRegion(type, entity);
}

module.exports = { getRegionContent, programChips };
