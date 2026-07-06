"use strict";

/* Customer reviews (provided by the site owner). Rendered on the homepage and
   emitted as Review + AggregateRating schema on the homepage only.
   NOTE: keep this in sync with real, verifiable reviews — self-serving review
   markup is not eligible for Google star rich results and unverifiable reviews
   carry spam-policy risk. */

const REVIEWS = [
  { author: "공*식", rating: 5, date: "2026-07-06", title: "예약 시간 변경",
    body: "당일 갑자기 회의가 생겨서 예약 시간을 2시간 뒤로 변경해야 했어요. 고객센터에 전화했더니 흔쾌히 변경해주셨고, 관리사님도 시간 잘 맞춰서 오셨어요. 변경이 잦은 직장인인데 이렇게 유연하게 대응해주셔서 감사했어요." },
  { author: "조*경", rating: 4, date: "2026-07-05", title: "예약 취소 경험",
    body: "갑자기 해외출장이 잡혀서 예약을 취소해야 했어요. 취소 수수료가 발생할 줄 알았는데 첫 번째 취소라 무료로 해주셨어요. 친절하게 응대해주셔서 좋았고, 정책이 고객 친화적이라 마음에 들어요." },
  { author: "허*나", rating: 5, date: "2026-07-04", title: "마사지 시간 연장",
    body: "1시간 예약했는데 너무 좋아서 연장하고 싶다고 말씀드렸어요. 다행히 다음 예약이 없어서 30분 더 받을 수 있었어요. 연장 요청을 흔쾌히 받아주시고 추가 시간도 충실히 봐주셨어요." },
  { author: "이*환", rating: 3, date: "2026-07-03", title: "관리사 지각 경험",
    body: "예약 시간보다 20분 늦게 오셨어요. 교통체증 때문에 미리 연락은 왔지만 기다리는 동안 조금 불편했어요. 그래도 마사지 자체는 잘해주셨고 지각한 시간만큼 연장해주셨어요." },
  { author: "최*리", rating: 3, date: "2026-07-02", title: "강도 조절 아쉬움",
    body: "약하게 해달라고 했는데 처음엔 계속 세게 누르셨어요. 중간에 다시 말씀드렸더니 그때부터 조정해주셨지만, 처음부터 반영됐으면 좋았을 것 같아요. 이후에는 잘해주셨어요." },
  { author: "정*우", rating: 5, date: "2026-07-01", title: "특별 요청 처리",
    body: "어깨에 유난히 뭉친 곳이 있어서 그 부분을 집중적으로 해달라고 요청했어요. 관리사님이 세심하게 그 부위만 20분 동안 풀어주셨어요. 요청사항을 충실히 반영해주셔서 만족스러웠어요." },
  { author: "남*준", rating: 4, date: "2026-06-30", title: "관리사 교체 경험",
    body: "예약한 관리사님이 개인 사정으로 오지 못하게 되어 다른 분이 오셨어요. 미리 연락이 와서 당황하지 않았고, 오신 분도 실력이 좋으셨어요. 선호 스타일이 있어 조금 아쉬웠지만 대응은 훌륭했어요." },
  { author: "도*진", rating: 3, date: "2026-06-29", title: "장비 문제 대응",
    body: "관리사님이 가져오신 오일 펌프가 고장 나서 오일을 덜 사용하게 됐어요. 마찰이 조금 있어 아쉬웠지만 바로 수건을 더 가져와 대처해주셨어요. 준비가 더 철저했으면 좋았을 것 같아요." },
  { author: "서*리", rating: 2, date: "2026-06-28", title: "소음 아쉬움",
    body: "마사지 내내 휴대폰 알림 소리가 계속 울렸어요. 조용히 받고 싶었는데 방해가 됐어요. 조용한 환경을 원하면 미리 요청해야 할 것 같아요. 마사지 실력은 괜찮았지만 분위기가 아쉬웠어요." },
  { author: "이*영", rating: 5, date: "2026-06-27", title: "반려동물과 함께",
    body: "강아지랑 같이 사는데 관리사님이 동물을 좋아하셔서 분위기가 오히려 좋아졌어요. 강아지가 옆에 있는 동안 편안하게 마사지 받았어요. 반려동물과 함께해도 괜찮은 곳이라 좋았어요." },
];

const total = REVIEWS.reduce((s, r) => s + r.rating, 0);
const RATING = {
  count: REVIEWS.length,
  avg: (total / REVIEWS.length).toFixed(1), // "3.9"
};

module.exports = { REVIEWS, RATING };
