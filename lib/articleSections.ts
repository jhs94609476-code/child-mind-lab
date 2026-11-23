const markerPattern = /<!--\s*TUTORING_BANNER_([123])\s*-->/g;
const voidElements = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

export function getArticleSections(html: string) {
  const tags = /<!--[\s\S]*?-->|<\/?([a-z][\w:-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
  const openTags: string[] = [];
  const boundaries: number[] = [];
  const markers: Record<string, number[]> = { "1": [], "2": [] };

  // Split only between top-level blocks so each HTML fragment stays intact.
  for (const { 0: tag, 1: name, index } of html.matchAll(tags)) {
    if (!name) {
      const marker = tag.match(/^<!--\s*TUTORING_BANNER_([12])\s*-->$/);
      if (marker && openTags.length === 0) markers[marker[1]].push(index);
      continue;
    }

    const element = name.toLowerCase();
    if (tag.startsWith("</")) {
      const openIndex = openTags.lastIndexOf(element);
      if (openIndex !== -1) openTags.length = openIndex;
    } else {
      if (openTags.length === 0 && index > 0) boundaries.push(index);
      if (!voidElements.has(element) && !tag.endsWith("/>")) openTags.push(element);
    }
  }

  const top = markers["1"].find((index) => index < html.length * 0.45) ?? 0;
  const middle = markers["2"].find((index) => index > top)
    ?? boundaries.filter((index) => index > top).reduce(
      (nearest, index) => Math.abs(index - html.length / 2) < Math.abs(nearest - html.length / 2)
        ? index
        : nearest,
      html.length
    );

  return [
    html.slice(0, top),
    html.slice(top, middle),
    html.slice(middle),
  ].map((fragment) => fragment.replace(markerPattern, "").trim());
}
