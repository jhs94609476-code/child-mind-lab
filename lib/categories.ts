export const categories = [
  {
    name: "자녀심리",
    slug: "child-psychology",
    description: "초등·사춘기 자녀의 감정과 행동을 이해하고 대화하는 방법을 소개합니다.",
  },
  {
    name: "생활습관",
    slug: "daily-habits",
    description: "수면, 스마트폰 사용, 정리 등 아이가 건강한 생활습관을 기르는 방법을 소개합니다.",
  },
  {
    name: "학교생활",
    slug: "school-life",
    description: "새 학기 적응, 친구 관계, 학교와의 소통을 돕는 정보를 모았습니다.",
  },
  {
    name: "부모멘탈",
    slug: "parent-wellbeing",
    description: "양육 스트레스와 감정을 돌보고 부모로서 균형을 찾는 방법을 소개합니다.",
  },
  {
    name: "공부법",
    slug: "study-methods",
    description: "중·고등학생을 위한 과목별 공부법, 내신 관리, 시험 대비, 자기주도학습과 성적을 높이는 학습 습관을 다룹니다.",
  },
  {
    name: "입시",
    slug: "admissions",
    description: "고교학점제, 고등학교 진학, 내신과 수능, 수시·정시, 학생부종합전형, 대학 진학과 진로 정보를 정리합니다.",
  },
] as const;

export const categoryPageSize = 20;

export function categoryPageCount(postCount: number) {
  return Math.max(1, Math.ceil(postCount / categoryPageSize));
}

export function categoryPageHref(slug: string, page = 1) {
  const base = `/category/${slug}/`;
  return page === 1 ? base : `${base}page/${page}/`;
}
