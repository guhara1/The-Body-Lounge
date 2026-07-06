"use strict";

/* Structural registry: every page's slug, Korean name, and relationships.
   Content bodies live in ./content/*.js and are keyed by these slugs. */

const AREAS = [
  {
    slug: "gangnam-southeast",
    name: "강남·동남권",
    gu: ["gangnam-gu", "seocho-gu", "songpa-gu", "gangdong-gu"],
    lifezones: [
      "gangnam-yeoksam", "samseong-seolleung", "cheongdam-apgujeong",
      "nonhyeon-sinsa", "seocho-gyodae", "banpo-terminal",
      "jamsil-songpa", "munjeong-garak",
    ],
  },
  {
    slug: "southwest",
    name: "서남권",
    gu: ["yeongdeungpo-gu", "guro-gu", "geumcheon-gu", "gwanak-gu", "dongjak-gu", "yangcheon-gu", "gangseo-gu"],
    lifezones: [
      "yeouido-yeongdeungpo", "mullae-dangsan", "gudi-gadi", "magok-balsan",
      "mokdong-yangcheon", "sillim-seoul-univ", "sadang-isu",
    ],
  },
  {
    slug: "northwest",
    name: "서북권",
    gu: ["mapo-gu", "seodaemun-gu", "eunpyeong-gu"],
    lifezones: ["hongdae-hapjeong", "gongdeok-mapo", "yeonsinnae-eunpyeong"],
  },
  {
    slug: "northeast",
    name: "동북권",
    gu: ["seongdong-gu", "gwangjin-gu", "dongdaemun-gu", "jungnang-gu", "nowon-gu", "dobong-gu", "gangbuk-gu", "seongbuk-gu"],
    lifezones: ["seongsu-wangsimni", "kondae-gwangjin", "nowon-sanggye"],
  },
  {
    slug: "central",
    name: "도심·중부권",
    gu: ["jongno-gu", "jung-gu", "yongsan-gu"],
    lifezones: ["yongsan-seoul-station", "hannam-itaewon", "jongno-gwanghwamun", "myeongdong-euljiro"],
  },
];

const GU = [
  { slug: "gangnam-gu", name: "강남구", area: "gangnam-southeast" },
  { slug: "seocho-gu", name: "서초구", area: "gangnam-southeast" },
  { slug: "songpa-gu", name: "송파구", area: "gangnam-southeast" },
  { slug: "gangdong-gu", name: "강동구", area: "gangnam-southeast" },
  { slug: "yeongdeungpo-gu", name: "영등포구", area: "southwest" },
  { slug: "guro-gu", name: "구로구", area: "southwest" },
  { slug: "geumcheon-gu", name: "금천구", area: "southwest" },
  { slug: "gwanak-gu", name: "관악구", area: "southwest" },
  { slug: "dongjak-gu", name: "동작구", area: "southwest" },
  { slug: "yangcheon-gu", name: "양천구", area: "southwest" },
  { slug: "gangseo-gu", name: "강서구", area: "southwest" },
  { slug: "mapo-gu", name: "마포구", area: "northwest" },
  { slug: "seodaemun-gu", name: "서대문구", area: "northwest" },
  { slug: "eunpyeong-gu", name: "은평구", area: "northwest" },
  { slug: "seongdong-gu", name: "성동구", area: "northeast" },
  { slug: "gwangjin-gu", name: "광진구", area: "northeast" },
  { slug: "dongdaemun-gu", name: "동대문구", area: "northeast" },
  { slug: "jungnang-gu", name: "중랑구", area: "northeast" },
  { slug: "nowon-gu", name: "노원구", area: "northeast" },
  { slug: "dobong-gu", name: "도봉구", area: "northeast" },
  { slug: "gangbuk-gu", name: "강북구", area: "northeast" },
  { slug: "seongbuk-gu", name: "성북구", area: "northeast" },
  { slug: "jongno-gu", name: "종로구", area: "central" },
  { slug: "jung-gu", name: "중구", area: "central" },
  { slug: "yongsan-gu", name: "용산구", area: "central" },
];

const LIFEZONES = [
  { slug: "gangnam-yeoksam", name: "강남역·역삼", area: "gangnam-southeast" },
  { slug: "samseong-seolleung", name: "삼성·선릉", area: "gangnam-southeast" },
  { slug: "cheongdam-apgujeong", name: "청담·압구정", area: "gangnam-southeast" },
  { slug: "nonhyeon-sinsa", name: "논현·신사", area: "gangnam-southeast" },
  { slug: "seocho-gyodae", name: "서초·교대", area: "gangnam-southeast" },
  { slug: "banpo-terminal", name: "반포·고속터미널", area: "gangnam-southeast" },
  { slug: "jamsil-songpa", name: "잠실·송파", area: "gangnam-southeast" },
  { slug: "munjeong-garak", name: "문정·가락", area: "gangnam-southeast" },
  { slug: "hongdae-hapjeong", name: "홍대·합정", area: "northwest" },
  { slug: "gongdeok-mapo", name: "공덕·마포", area: "northwest" },
  { slug: "yeouido-yeongdeungpo", name: "여의도·영등포", area: "southwest" },
  { slug: "mullae-dangsan", name: "문래·당산", area: "southwest" },
  { slug: "gudi-gadi", name: "구디·가디", area: "southwest" },
  { slug: "magok-balsan", name: "마곡·발산", area: "southwest" },
  { slug: "seongsu-wangsimni", name: "성수·왕십리", area: "northeast" },
  { slug: "kondae-gwangjin", name: "건대·광진", area: "northeast" },
  { slug: "yongsan-seoul-station", name: "용산·서울역", area: "central" },
  { slug: "hannam-itaewon", name: "한남·이태원", area: "central" },
  { slug: "mokdong-yangcheon", name: "목동·양천", area: "southwest" },
  { slug: "sillim-seoul-univ", name: "신림·서울대입구", area: "southwest" },
  { slug: "sadang-isu", name: "사당·이수", area: "southwest" },
  { slug: "yeonsinnae-eunpyeong", name: "연신내·은평", area: "northwest" },
  { slug: "nowon-sanggye", name: "노원·상계", area: "northeast" },
  { slug: "jongno-gwanghwamun", name: "종로·광화문", area: "central" },
  { slug: "myeongdong-euljiro", name: "명동·을지로", area: "central" },
];

const STATIONS = [
  { slug: "gangnam-station", name: "강남역", life: "gangnam-yeoksam" },
  { slug: "yeoksam-station", name: "역삼역", life: "gangnam-yeoksam" },
  { slug: "seolleung-station", name: "선릉역", life: "samseong-seolleung" },
  { slug: "samseong-station", name: "삼성역", life: "samseong-seolleung" },
  { slug: "jamsil-station", name: "잠실역", life: "jamsil-songpa" },
  { slug: "munjeong-station", name: "문정역", life: "munjeong-garak" },
  { slug: "hongik-univ-station", name: "홍대입구역", life: "hongdae-hapjeong" },
  { slug: "hapjeong-station", name: "합정역", life: "hongdae-hapjeong" },
  { slug: "gongdeok-station", name: "공덕역", life: "gongdeok-mapo" },
  { slug: "yeouido-station", name: "여의도역", life: "yeouido-yeongdeungpo" },
  { slug: "yeongdeungpo-station", name: "영등포역", life: "yeouido-yeongdeungpo" },
  { slug: "seongsu-station", name: "성수역", life: "seongsu-wangsimni" },
  { slug: "wangsimni-station", name: "왕십리역", life: "seongsu-wangsimni" },
  { slug: "kondae-station", name: "건대입구역", life: "kondae-gwangjin" },
  { slug: "seoul-station", name: "서울역", life: "yongsan-seoul-station" },
  { slug: "yongsan-station", name: "용산역", life: "yongsan-seoul-station" },
  { slug: "sadang-station", name: "사당역", life: "sadang-isu" },
  { slug: "sillim-station", name: "신림역", life: "sillim-seoul-univ" },
  { slug: "gasan-digital-station", name: "가산디지털단지역", life: "gudi-gadi" },
  { slug: "guro-digital-station", name: "구로디지털단지역", life: "gudi-gadi" },
  { slug: "magok-station", name: "마곡역", life: "magok-balsan" },
  { slug: "balsan-station", name: "발산역", life: "magok-balsan" },
  { slug: "mokdong-station", name: "목동역", life: "mokdong-yangcheon" },
  { slug: "yeonsinnae-station", name: "연신내역", life: "yeonsinnae-eunpyeong" },
  { slug: "nowon-station", name: "노원역", life: "nowon-sanggye" },
  { slug: "jongno-3ga-station", name: "종로3가역", life: "jongno-gwanghwamun" },
  { slug: "gwanghwamun-station", name: "광화문역", life: "jongno-gwanghwamun" },
  { slug: "myeongdong-station", name: "명동역", life: "myeongdong-euljiro" },
  { slug: "euljiro-1ga-station", name: "을지로입구역", life: "myeongdong-euljiro" },
];

const PROGRAMS = [
  { slug: "swedish", name: "스웨디시", short: "부드러운 압의 릴렉스 오일 관리" },
  { slug: "thai-massage", name: "타이마사지", short: "스트레칭 중심의 전신 관리" },
  { slug: "aroma-therapy", name: "아로마테라피", short: "오일과 향을 활용한 릴렉스 관리" },
  { slug: "sports-massage", name: "스포츠 마사지", short: "운동 후 부위별 압 조절 관리" },
  { slug: "foot-massage", name: "발마사지", short: "발·종아리 집중 관리" },
  { slug: "deep-tissue", name: "딥티슈", short: "깊은 근막층 집중 관리" },
  { slug: "lomi-lomi", name: "로미로미", short: "하와이식 리듬 오일 관리" },
  { slug: "couple", name: "커플 관리", short: "2인 동시 진행 관리" },
  { slug: "night", name: "야간 예약", short: "야간 시간대 예약 기준" },
  { slug: "men", name: "남성 고객 안내", short: "남성 고객 이용 안내" },
  { slug: "women", name: "여성 고객 안내", short: "여성 고객 이용 안내" },
];

const USE = [
  { slug: "home", name: "자택", h1: "서울 자택·방문 출장마사지 예약 전 주소 확인 기준" },
  { slug: "hotel", name: "호텔·숙소", h1: "서울 호텔·숙소 출장마사지 예약 전 확인사항" },
  { slug: "officetel", name: "오피스텔", h1: "서울 오피스텔 출장마사지 공동현관·관리규정 안내" },
  { slug: "apartment", name: "아파트", h1: "서울 아파트·단지 출장마사지 방문 출입 기준" },
  { slug: "business-district", name: "업무지구", h1: "서울 업무지구 출장마사지 퇴근 후 예약 기준" },
  { slug: "station-area", name: "역세권", h1: "서울 역세권 출장마사지 이동·접근 기준" },
  { slug: "tour-accommodation", name: "관광 숙소", h1: "서울 관광 숙소 출장마사지 명동·홍대·이태원 이용 기준" },
  { slug: "night", name: "야간 이용", h1: "서울 야간 출장마사지 예약 가능 시간·출입 확인" },
  { slug: "outer-area", name: "외곽 이동", h1: "서울 외곽 지역 출장마사지 이동 거리·시간 기준" },
];

const CHECK = [
  { slug: "address", name: "주소 확인", h1: "방문 주소 확인 기준" },
  { slug: "building-access", name: "건물 출입", h1: "건물 출입 방식 확인" },
  { slug: "apartment-access", name: "아파트 출입", h1: "아파트 단지 출입 기준" },
  { slug: "hotel-policy", name: "호텔 정책", h1: "호텔·숙소 방문 정책 확인" },
  { slug: "officetel-rule", name: "오피스텔 규정", h1: "오피스텔 관리 규정 확인" },
  { slug: "business-district", name: "업무지구", h1: "업무지구 방문 기준" },
  { slug: "parking", name: "주차", h1: "주차·차량 이동 확인" },
  { slug: "night-access", name: "야간 출입", h1: "야간 건물 출입 확인" },
  { slug: "time", name: "예약 시간", h1: "예약 가능 시간 확인" },
  { slug: "change-policy", name: "변경 기준", h1: "예약 변경·취소 기준" },
  { slug: "privacy", name: "개인정보", h1: "개인정보 처리 기준" },
  { slug: "service-policy", name: "불법·선정적 서비스 불가", h1: "불법·선정적 서비스 불가 안내" },
  { slug: "customer-notice", name: "고객 이용 안내", h1: "고객 이용 안내" },
];

// lookup helpers
const byslug = (arr) => Object.fromEntries(arr.map((x) => [x.slug, x]));

module.exports = {
  AREAS,
  GU,
  LIFEZONES,
  STATIONS,
  PROGRAMS,
  USE,
  CHECK,
  maps: {
    area: byslug(AREAS),
    gu: byslug(GU),
    life: byslug(LIFEZONES),
    station: byslug(STATIONS),
    program: byslug(PROGRAMS),
    use: byslug(USE),
    check: byslug(CHECK),
  },
};
