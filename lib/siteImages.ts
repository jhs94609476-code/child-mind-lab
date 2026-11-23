export const commonThumbnail = {
  src: "/og-image.png",
  width: 540,
  height: 547,
};

const destination = "http://www.9ssamstudy.com";

export const tutoringBanners = {
  top: {
    id: "gussam-banner-1",
    placement: "article_top",
    src: "/gussam-banner-1.webp",
    width: 1536,
    height: 512,
    alt: "구쌤과외 학년별·과목별 맞춤 과외",
    destination,
  },
  middle: {
    id: "gussam-banner-2",
    placement: "article_middle",
    src: "/gussam-banner-2.webp",
    width: 1536,
    height: 512,
    alt: "구쌤과외 공부 방법 상담",
    destination,
  },
  bottom: {
    id: "gussam-banner-3",
    placement: "article_bottom",
    src: "/gussam-banner-3.webp",
    width: 1536,
    height: 512,
    alt: "구쌤과외 꼴지에서 일등 만들기 프로젝트와 무료 모의수업",
    destination,
  },
  floating: {
    id: "gussam-floating",
    placement: "floating",
    src: "/gussam-floating.webp",
    width: 480,
    height: 525,
    alt: "구쌤과외 무료 모의수업 신청",
    destination,
  },
} as const;

export type TutoringPlacement = keyof typeof tutoringBanners;
