// scripts/build-from-cache.js
// 이미 다운로드된 content.md 파일에서 CSV를 추출하여 posts.json 생성
// (네트워크 접속이 안 될 때 사용)

const fs = require("fs");
const path = require("path");

const CONTENT_MD = path.join(
  "C:\\Users\\82109\\.gemini\\antigravity-ide\\brain\\57fcf596-51ce-4045-8b70-e65b91ce6a13\\.system_generated\\steps\\5\\content.md"
);

// 쿠팡 배너 HTML
const AD_BANNERS = {
  top: `<div class="ad-banner ad-top"><a href="https://link.coupang.com/a/gDAv9GUYeq" target="_blank" referrerpolicy="unsafe-url"><img src="https://ads-partners.coupang.com/banners/1013103?trackingCode=AF5508221&subId=&traceId=V0-301-969b06e95b87326d-I1013103&w=300&h=250" alt="쿠팡 광고" width="300" height="250" /></a></div>`,
  middle: `<div class="ad-banner ad-middle"><a href="https://link.coupang.com/a/gDArgFgOYe" target="_blank" referrerpolicy="unsafe-url"><img src="https://ads-partners.coupang.com/banners/1023990?trackingCode=AF5508221&subId=&traceId=V0-301-879dd1202e5c73b2-I1023990&w=200&h=200" alt="쿠팡 광고" width="200" height="200" /></a></div>`,
  bottom: `<div class="ad-banner ad-bottom"><a href="https://link.coupang.com/a/gDAxT8JGWy" target="_blank" referrerpolicy="unsafe-url"><img src="https://ads-partners.coupang.com/banners/1023996?trackingCode=AF5508221&subId=&traceId=V0-301-bae0f72e5e59e45f-I1023996&w=300&h=250" alt="쿠팡 광고" width="300" height="250" /></a></div>`,
};

function parseCsvRobust(csvText) {
  // \r\n 정규화
  const text = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const rows = [];
  let i = 0;
  const len = text.length;

  // 첫 줄(헤더) 읽기
  function readField() {
    if (i >= len) return null;
    let field = "";
    if (text[i] === '"') {
      i++; // opening quote
      while (i < len) {
        if (text[i] === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i += 2;
          } else {
            i++; // closing quote
            break;
          }
        } else {
          field += text[i];
          i++;
        }
      }
    } else {
      while (i < len && text[i] !== "," && text[i] !== "\n") {
        field += text[i];
        i++;
      }
    }
    return field;
  }

  function readRow() {
    const fields = [];
    while (i < len && text[i] !== "\n") {
      fields.push(readField());
      if (i < len && text[i] === ",") i++;
    }
    if (i < len && text[i] === "\n") i++;
    return fields;
  }

  const headers = readRow();
  while (i < len) {
    // 빈 줄 건너뛰기
    while (i < len && text[i] === "\n") i++;
    if (i >= len) break;
    const values = readRow();
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

function parseFrontmatter(raw) {
  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!fmMatch) return { title: "", summary: "", keywords: "", body: raw };

  const fmBlock = fmMatch[1];
  const body = fmMatch[2];

  const getValue = (key) => {
    const lineMatch = fmBlock.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return lineMatch ? lineMatch[1].trim() : "";
  };

  return {
    title: getValue("title"),
    summary: getValue("summary"),
    keywords: getValue("keywords"),
    body: body.trim(),
  };
}

function injectAds(html) {
  return html
    .replace(/<!--\s*DYNAMIC_AD_1\s*-->/g, AD_BANNERS.top)
    .replace(/<!--\s*DYNAMIC_AD_2\s*-->/g, AD_BANNERS.middle)
    .replace(/<!--\s*DYNAMIC_AD_3\s*-->/g, AD_BANNERS.bottom);
}

function cleanContent(raw) {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```\s*html\s*\n?/i, "");
  cleaned = cleaned.replace(/\n?```\s*$/i, "");
  return cleaned.trim();
}

function main() {
  console.log("📂 캐시된 content.md 파일 읽는 중...");

  if (!fs.existsSync(CONTENT_MD)) {
    console.error("❌ content.md 파일이 없습니다.");
    process.exit(1);
  }

  // content.md는 첫 8줄이 메타데이터, 9번째 줄부터 CSV
  const fullText = fs.readFileSync(CONTENT_MD, "utf-8");
  const lines = fullText.split("\n");

  // 라인 9 (index 8)부터 CSV 시작
  const csvText = lines.slice(8).join("\n");
  console.log(`✅ CSV 데이터 추출 완료 (${(csvText.length / 1024).toFixed(1)} KB)`);

  const rows = parseCsvRobust(csvText);
  console.log(`📊 파싱된 행 수: ${rows.length}`);

  const posts = [];
  for (const row of rows) {
    const slug = (row["slug"] || "").trim();
    const category = (row["Category"] || "").trim();
    if (!slug || !category) continue;

    const rawContent = cleanContent(row["Content_Markdown"] || "");
    const { title, summary, keywords, body } = parseFrontmatter(rawContent);
    const html = injectAds(body);

    posts.push({ slug, category, title, summary, keywords, html });
  }

  console.log(`📝 처리된 포스트 수: ${posts.length}`);

  // data 디렉토리 생성
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, "posts.json");
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), "utf-8");

  const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`💾 저장 완료: data/posts.json (${fileSizeKB} KB)`);

  // 슬러그 목록 출력
  posts.slice(0, 5).forEach((p) => console.log(`  - ${p.slug}: ${p.title.slice(0, 30)}...`));
  if (posts.length > 5) console.log(`  ... 외 ${posts.length - 5}개`);
  console.log("🚀 빌드 준비 완료!");
}

main();
