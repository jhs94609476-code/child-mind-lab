"use client";

import Image from "next/image";
import { tutoringBanners, type TutoringPlacement } from "../lib/siteImages";

type TutoringClick = {
  banner_id: string;
  placement: string;
  destination_url: string;
  page_path: string;
};

declare global {
  interface Window {
    gtag?: (command: "event", event: "tutoring_click", values: TutoringClick) => void;
  }
}

export default function TutoringBanner({ placement }: { placement: TutoringPlacement }) {
  const banner = tutoringBanners[placement];

  function trackClick() {
    window.gtag?.("event", "tutoring_click", {
      banner_id: banner.id,
      placement: banner.placement,
      destination_url: banner.destination,
      page_path: window.location.pathname,
    });
  }

  return (
    <a
      className={`tutoring-banner tutoring-banner--${placement}`}
      href={banner.destination}
      target="_blank"
      rel="noopener noreferrer"
      data-banner-id={banner.id}
      onClick={trackClick}
      onAuxClick={(event) => {
        if (event.button === 1) trackClick();
      }}
    >
      <Image src={banner.src} alt={banner.alt} width={banner.width} height={banner.height} />
      {placement === "floating" && (
        <span className="floating-promo__label" aria-hidden="true">무료 모의수업 받기</span>
      )}
    </a>
  );
}
