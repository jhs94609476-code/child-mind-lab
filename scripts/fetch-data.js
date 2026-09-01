// scripts/fetch-data.js
// 빌드 전 Google Sheets CSV를 가져와 data/posts.json으로 저장
// Node.js 18+ 내장 fetch API 사용

const fs = require("fs");
const path = require("path");

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vStAETGqwhy2ux_FQAzPeS_bPUu_pIk_F7n79vO7LKCgAZ1KYHnqJ37WX5c2Higqtzx8gG6HBq7zouS/pub?gid=1700597570&single=true&output=csv";

// 쿠팡 배너 HTML
const AD_BANNERS = {
  top: `<div class="ad-banner ad-top"><a href="https://link.coupang.com/a/gDAv9GUYeq" target="_blank" referrerpolicy="unsafe-url"><img src="https://ads-partners.coupang.com/banners/1013103?trackingCode=AF5508221&subId=&traceId=V0-301-969b06e95b87326d-I1013103&w=300&h=250" alt="쿠팡 광고" width="300" height="250" /></a></div>`,
  middle: `<div class="ad-banner ad-middle"><a href="https://link.coupang.com/a/gDArgFgOYe" target="_blank" referrerpolicy="unsafe-url"><img src="https://ads-partners.coupang.com/banners/1023990?trackingCode=AF5508221&subId=&traceId=V0-301-879dd1202e5c73b2-I1023990&w=200&h=200" alt="쿠팡 광고" width="200" height="200" /></a></div>`,
  bottom: `<div class="ad-banner ad-bottom"><a href="https://link.coupang.com/a/gDAxT8JGWy" target="_blank" referrerpolicy="unsafe-url"><img src="https://ads-partners.coupang.com/banners/1023996?trackingCode=AF5508221&subId=&traceId=V0-301-bae0f72e5e59e45f-I1023996&w=300&h=250" alt="쿠팡 광고" width="300" height="250" /></a></div>`,
};

function parseCsvRobust(csvText) {
  const text = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  let i = 0;
  const len = text.length;

  function readField() {
    if (i >= len) return "";
    let field = "";
    if (text[i] === '"') {
      i++;
      while (i < len) {
        if (text[i] === '"') {
          if (i + 1 < len && text[i + 1] === '"') {
            field += '"';
            i += 2;
          } else {
            i++;
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
  const rows = [];
  while (i < len) {
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

function processCsv(csvText) {
  const rows = parseCsvRobust(csvText);
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
  return posts;
}

function generateRss(posts) {
  const baseUrl = "https://kids-mind-lab.vercel.app";
  const now = new Date().toUTCString();

  const itemsXml = posts
    .map((post) => {
      const link = `${baseUrl}/${post.slug}/`;
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description><![CDATA[${post.summary || post.title}]]></description>
      <category><![CDATA[${post.category}]]></category>
      <pubDate>${now}</pubDate>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>아이마음연구소 - 자녀심리 육아 전문 블로그</title>
    <link>${baseUrl}</link>
    <description>초등·사춘기 자녀 심리, 육아 고민 해결을 위한 전문 정보를 제공합니다.</description>
    <language>ko</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  const publicDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const rssPath = path.join(publicDir, "rss.xml");
  fs.writeFileSync(rssPath, rssXml, "utf-8");
  const kb = (fs.statSync(rssPath).size / 1024).toFixed(1);
  console.log(`📡 public/rss.xml 생성 완료 (${kb} KB)`);
}

function savePosts(posts) {
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const outputPath = path.join(dataDir, "posts.json");
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), "utf-8");
  const kb = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`💾 data/posts.json 저장 완료 (${kb} KB, ${posts.length}개 포스트)`);
  generateRss(posts);
}

async function main() {
  console.log("📥 Google Sheets CSV 데이터 가져오는 중...");
  console.log(`   URL: ${CSV_URL}`);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000); // 90초 타임아웃

    const res = await fetch(CSV_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/csv,text/plain,*/*",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const csvText = await res.text();
    console.log(`✅ CSV 수신 완료 (${(csvText.length / 1024).toFixed(1)} KB)`);

    const posts = processCsv(csvText);
    console.log(`📊 포스트 수: ${posts.length}`);
    savePosts(posts);
    console.log("🚀 빌드 준비 완료!");
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("❌ 요청 타임아웃 (90초). 네트워크 환경을 확인하세요.");
    } else {
      console.error("❌ CSV 가져오기 실패:", err.message);
    }
    // 기존 data/posts.json이 있으면 재사용
    const fallbackPath = path.join(__dirname, "..", "data", "posts.json");
    if (fs.existsSync(fallbackPath)) {
      console.log("⚠️  기존 data/posts.json을 재사용합니다.");
      try {
        const fallbackPosts = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
        generateRss(fallbackPosts);
      } catch (e) {}
    } else {
      console.error("🔴 data/posts.json도 없습니다. 빌드를 중단합니다.");
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error("❌ 예상치 못한 오류:", err);
  process.exit(1);
});
