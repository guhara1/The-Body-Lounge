# 간다GO — 서울 출장마사지 지역·프로그램 안내

서울 25개 구·주요 생활권·역세권과 마사지 프로그램, 이용 장소, 예약 전 확인사항을
안내하는 **정적 정보 사이트**입니다. 의존성 없는 Node 생성기로 빌드합니다.

- 상호: **간다GO**
- 전화 예약: **0508-202-4719**
- 제휴·제작 문의: 텔레그램 (푸터 오렌지 버튼)

## 빌드

```bash
npm run build     # build/ → 정적 HTML 생성 (루트에 출력)
npm run check     # 빌드 + 검증(lint): description 80자, JSON-LD, 내부링크, 본문 길이
```

## 구조

```
assets/            # CSS(토큰+컴포넌트), JS, 이미지
build/
  build.js         # 오케스트레이터
  lint.js          # 빌드 후 검증
  lib/             # site 설정, 컴포넌트(헤더/푸터/플로팅콜/스키마), 레이아웃, 콤포저
  data/
    registry.js    # 전체 페이지 슬러그·이름·관계
    pages.js       # 메인/프로그램/이용장소/확인/문의/사이트맵 템플릿
    profiles.js    # 지역별 고유 사실(콤포저 입력)
    content/*.js    # (선택) 지역별 상세 본문 오버라이드
seoul/             # 생성된 HTML (권역/구/생활권/역세권/프로그램/이용/확인)
sitemap.xml, robots.txt
```

## SEO 원칙 (요약)

- **E-E-A-T / Who·How·Why**: 모든 지역·프로그램 페이지에 작성 주체·방식·목적 블록.
- **스키마**: Organization·WebSite·WebPage·BreadcrumbList·FAQPage·ImageObject만 사용.
  LocalBusiness·Review·AggregateRating·가짜 별점은 사용하지 않음(실제 데이터 없음).
- **description 80자 이내** 강제(빌드 시 초과하면 실패).
- **내부링크**: 지역 → 프로그램 / 프로그램 → 지역 / 지역 → 예약 전 확인.
- **불법·선정적 서비스 불가** 안내를 모든 주요 페이지에 노출.
- 프로그램명만 바꾼 얇은 페이지·출구별·번호동 페이지는 생성하지 않음.

배포 도메인 확정 시 `build/lib/site.js`의 `origin` 값을 실제 도메인으로 교체하세요.
