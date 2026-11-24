# Child Mind Lab — 아이마음연구소

자녀심리 육아 정보 전문 정적 블로그 (Google Sheets CSV 기반)

## 기술 스택

- **Framework**: Next.js 15 (App Router, 게시글 사전 렌더링)
- **Language**: TypeScript
- **Style**: Vanilla CSS
- **Data Source**: Google Sheets CSV
- **Deploy**: Vercel

## 로컬 개발

```bash
npm install
npm run dev
```

## 빌드 & 배포

```bash
npm run build
npm start
```

## 주요 기능

- 빌드 시 CSV 자동 파싱 → 정적 라우팅 생성
- 게시글 상·중·하 구쌤과외 배너와 PC 우측·모바일 하단 고정 배너
- 홈에서 카테고리별 최대 10개 표시 및 카테고리 전체 글 페이지 (페이지당 20개)
- 같은 카테고리 관련 글 5개씩 페이지네이션
- SEO 최적화 (OG 메타태그, title, description, keywords)
- Vercel 표준 Next.js 빌드

## 데이터 업데이트

Google Sheets를 수정한 뒤 Vercel에서 재배포하면 최신 데이터가 반영됩니다.

`npm run dev`와 `npm run build`는 공개 CSV를 읽고 `data/posts.json`과 `public/rss.xml`을 생성합니다. 다운로드에 실패하면 기존 JSON 캐시를 사용합니다. 저장된 CSV나 CSV가 포함된 `content.md`에서 복구할 수도 있습니다.

```bash
node scripts/build-from-cache.js path/to/content.csv
node scripts/build-from-cache.js path/to/content.md
```

경로를 생략하면 현재 JSON 캐시를 정규화하고 RSS를 다시 생성합니다. 배너의 파일명, 연결 주소와 추적 ID는 `lib/siteImages.ts`에서 관리합니다.

## Google Analytics 4

빌드 환경에 `NEXT_PUBLIC_GA_MEASUREMENT_ID`를 설정하면 GA4가 활성화됩니다. 로컬에서는 `.env.local`에 설정할 수 있습니다. 측정 ID를 비워 두면 사이트와 배너 링크는 그대로 작동합니다.

배너 클릭은 `tutoring_click`으로 전송하며 `banner_id`, `placement`, `destination_url`, `page_path`를 포함합니다. `page_path`에서 쿼리와 해시는 제외합니다.
