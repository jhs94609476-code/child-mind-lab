# Child Mind Lab — 아이마음연구소

자녀심리 육아 정보 전문 정적 블로그 (Google Sheets CSV 기반)

## 기술 스택

- **Framework**: Next.js 15 (App Router, Static Export)
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
# out/ 폴더에 정적 파일 생성
```

## 주요 기능

- 빌드 시 CSV 자동 파싱 → 정적 라우팅 생성
- 쿠팡 파트너스 배너 자동 삽입 (상/중/하)
- 같은 카테고리 관련 글 5개씩 페이지네이션
- SEO 최적화 (OG 메타태그, title, description, keywords)
- Vercel 정적 배포 지원

## 데이터 업데이트

Google Sheets를 수정한 뒤 Vercel에서 재배포하면 최신 데이터가 반영됩니다.
