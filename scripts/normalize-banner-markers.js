const legacyUrls = /(?:link|ads-partners)\.coupang\.com\b/i;
const legacySlots = ["ad-top", "ad-middle", "ad-bottom"];

function normalizeBannerMarkers(html) {
  return html
    .replace(/<div\b([^>]*)>\s*(<a\b[^>]*>\s*<img\b[^>]*>\s*<\/a>)\s*<\/div>/gi, (block, attributes, banner) => {
      const classValue = attributes.match(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const classes = (classValue?.[1] ?? classValue?.[2] ?? "").split(/\s+/);
      if (!classes.includes("ad-banner") || !legacyUrls.test(banner)) return block;

      const slot = legacySlots.findIndex((name) => classes.includes(name));
      return slot >= 0 ? `<!-- TUTORING_BANNER_${slot + 1} -->` : "";
    })
    .replace(/<a\b([^>]*)>\s*<img\b[^>]*>\s*<\/a>/gi, (banner) =>
      legacyUrls.test(banner) ? "" : banner
    )
    .replace(/<img\b[^>]*>/gi, (image) => legacyUrls.test(image) ? "" : image)
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (link, attributes, label) =>
      legacyUrls.test(attributes) ? label : link
    )
    .replace(/<!--\s*DYNAMIC_AD_([123])\s*-->/g, "<!-- TUTORING_BANNER_$1 -->");
}

function normalizePosts(posts) {
  return posts.map((post) => {
    const html = normalizeBannerMarkers(post.html);
    if (legacyUrls.test(html)) {
      throw new Error(`제거되지 않은 기존 배너 주소가 있습니다: ${post.slug}`);
    }
    return html === post.html ? post : { ...post, html };
  });
}

module.exports = { normalizeBannerMarkers, normalizePosts };
