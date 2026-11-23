import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__logo">
          <span className="site-header__mark" aria-hidden="true">🌿</span>
          아이마음연구소
        </Link>
        <span className="site-header__subtitle">자녀 심리 · 육아 전문 정보</span>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>자녀 심리 · 사춘기 육아 · 감정코칭 전문 블로그</p>
        <p>© 2025 아이마음연구소. All rights reserved.</p>
      </div>
    </footer>
  );
}
