import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kids-mind-lab.vercel.app"),
  title: {
    default: "아이마음연구소 - 자녀심리 육아 전문 블로그",
    template: "%s | 아이마음연구소",
  },
  description:
    "초등·사춘기 자녀 심리, 육아 고민 해결을 위한 전문 정보를 제공합니다.",
  icons: {
    icon: "/favicon.ico",
  },
  // 검색엔진 소유 확인
  verification: {
    google: "hNvXWg0ehlmQ3dY5uT1fMkwxAk104_EY265xnfmCVfg",
  },
  other: {
    "naver-site-verification": "32ce9fe18e9b694a52638f67709e3fa83664f82b",
  },
  // SNS 링크 미리보기 (Open Graph)
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://kids-mind-lab.vercel.app",
    siteName: "아이마음연구소",
    title: "아이마음연구소 - 자녀심리 육아 전문 블로그",
    description:
      "초등·사춘기 자녀 심리, 육아 고민 해결을 위한 전문 정보를 제공합니다.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "아이마음연구소 - 자녀심리 육아 전문 블로그",
      },
    ],
  },
  // 트위터(X) 카드
  twitter: {
    card: "summary_large_image",
    title: "아이마음연구소 - 자녀심리 육아 전문 블로그",
    description:
      "초등·사춘기 자녀 심리, 육아 고민 해결을 위한 전문 정보를 제공합니다.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
