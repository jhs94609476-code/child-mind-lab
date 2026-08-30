import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://child-mind-lab.vercel.app"),
  title: {
    default: "아이마음연구소 - 자녀심리 육아 전문 블로그",
    template: "%s | 아이마음연구소",
  },
  description:
    "초등·사춘기 자녀 심리, 육아 고민 해결을 위한 전문 정보를 제공합니다.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    siteName: "아이마음연구소",
    images: [{ url: "/og-image.png" }],
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
