"use client";

import { useEffect, useState } from "react";
import TutoringBanner from "./TutoringBanner";

const dismissalKey = "gussam-floating-dismissed";

export default function FloatingTutoring() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(sessionStorage.getItem(dismissalKey) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(dismissalKey, "1");
    } catch {
      // The root layout keeps the dismissal through navigation in this tab.
    }
  }

  if (!visible) return null;

  return (
    <aside className="floating-promo" aria-label="구쌤과외 무료 모의수업">
      <div className="floating-promo__card">
        <TutoringBanner placement="floating" />
        <button type="button" className="floating-promo__close" onClick={dismiss} aria-label="과외 배너 닫기">
          ×
        </button>
      </div>
    </aside>
  );
}
