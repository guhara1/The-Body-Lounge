# 지역 콘텐츠 작성 계약 (content authoring contract)

이 폴더의 `districts/*.js`, `lifezones/*.js`, `stations/*.js` 파일은 각 지역
페이지의 **고유 본문**을 제공합니다. 생성기(build.js)가 이 데이터를 표준 H2
구조(생활권 특징 → 역세권/이동 → 호텔 → 오피스텔 → 아파트 → 업무지구·관광숙소
→ 프로그램 선택 → 체크리스트 → 개인정보 → 불법·선정적 서비스 불가 → FAQ →
Who/How/Why → 관련 지역)에 끼워 넣습니다. 개인정보·불법·선정적·체크리스트
섹션은 생성기가 자동으로 붙이므로 **작성하지 않습니다.**

## 모듈 형태

```js
"use strict";
module.exports = {
  "<slug>": {
    lifeFeature: [ `...`, `...` ],   // 생활권 특징. HTML 문단 2개
    access:      [ `...` ],           // 가까운 역세권과 이동 기준. 문단 1~2개
    hotel:       [ `...` ],           // 호텔·숙소 이용 전 확인. 문단 1개
    officetel:   [ `...` ],           // 오피스텔 이용 전 확인. 문단 1개
    apartment:   [ `...` ],           // 아파트·자택 이용 전 확인. 문단 1개
    business:    [ `...` ],           // 업무지구·관광 숙소 이용 기준. 문단 1개
    programGuide:[ `...` ],           // 마사지 프로그램 선택 기준. 문단 1개
    programLinks:[ {name:`스웨디시`, href:`/seoul/program/swedish/`}, ... ], // 3~4개
    faqs: [ {q:`...`, a:`...`}, ... ], // 4개. 순수 텍스트(HTML·따옴표 금지)
    whw: { who:`...`, how:`...`, why:`...` }, // 순수 텍스트
  },
  // ...
};
```

## 규칙

1. **모든 문자열 값은 백틱(``` ` ```) 템플릿 리터럴**로 감쌉니다. (이스케이프 문제 방지)
2. `lifeFeature/access/hotel/officetel/apartment/business/programGuide` 문단에는
   HTML을 넣을 수 있습니다: `<strong>…</strong>`, 내부링크 `<a href="/seoul/...">…</a>`.
   - 내부링크 대상만 사용: `/seoul/program/<slug>/`, `/seoul/check/<slug>/`,
     `/seoul/use/<slug>/`, `/seoul/<gu-slug>/`, `/seoul/life/<slug>/`, `/seoul/station/<slug>/`.
3. **faqs 의 q/a 와 whw 는 순수 텍스트**. HTML 태그·큰따옴표(") 넣지 마세요(자동 escape됨).
4. **각 지역은 서로 다른 실제 특성**을 반영해 고유하게 작성합니다. 문장을 지역명만
   바꿔 복붙하지 마세요. 같은 표현 반복 금지. 지역별 실제 건물 유형·상권·교통을 반영.
5. 분량: 한 지역의 문단 섹션 합계 **한국어 1,400~2,000자**가 목표(과한 반복 없이 충실하게).
6. **금지**: 선정적·성적 암시, 허위 후기·별점, "24시간 무조건 가능" 류 단정, 의료
   효능 주장, 특정 업소·가격 단정. 모두 "예약 전 확인 안내" 톤 유지.
7. 한국어는 어절 단위로 자연스럽게(`word-break: keep-all` 환경).

## 유효 slug

- program: `swedish, thai-massage, aroma-therapy, sports-massage, foot-massage, deep-tissue, lomi-lomi, couple, night, men, women`
- check: `address, building-access, apartment-access, hotel-policy, officetel-rule, business-district, parking, night-access, time, change-policy, privacy, service-policy, customer-notice`
- use: `home, hotel, officetel, apartment, business-district, station-area, tour-accommodation, night, outer-area`

## 검증

작성 후 반드시:
```bash
node -e "const m=require('<파일경로>'); console.log(Object.keys(m).length, '개', Object.keys(m).join(','))"
```
가 오류 없이 실행되고 담당 slug 수와 일치해야 합니다.
