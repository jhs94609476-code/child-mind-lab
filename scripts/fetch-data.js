// scripts/fetch-data.js
// 빌드 전 Google Sheets CSV를 가져와 data/posts.json으로 저장
// Node.js 18+ 내장 fetch API 사용

const fs = require("fs");
const path = require("path");
const { normalizePosts } = require("./normalize-banner-markers");

const SHEET_GID = "1700597570";
const CSV_URL =
  `https://docs.google.com/spreadsheets/d/1aGeIcnU6FGBEIjEcWwr5CxxWe8WStvEYzoxxkFhvYgg/export?format=csv&gid=${SHEET_GID}`;
const CSV_COLUMNS = ["slug", "Category", "Content_Markdown"];

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

  const headers = readRow().map((header) => header.trim());
  if (!CSV_COLUMNS.every((column) => headers.includes(column))) {
    throw new Error("CSV에 slug, Category, Content_Markdown 열이 필요합니다.");
  }
  const rows = [];
  while (i < len) {
    while (i < len && text[i] === "\n") i++;
    if (i >= len) break;
    const values = readRow();
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
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
    posts.push({ slug, category, title, summary, keywords, html: body });
  }
  return normalizePosts(posts);
}

function generateRss(posts) {
  const baseUrl = "https://child-mind-lab-88rx.vercel.app";
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  let csvText;

  try {
    const res = await fetch(CSV_URL, {
      signal: controller.signal,
      headers: { Accept: "text/csv" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const contentType = res.headers.get("content-type") || "";
    if (!/^text\/csv(?:\s*;|$)/i.test(contentType)) {
      throw new Error(`HTTP ${res.status}: CSV 대신 ${contentType || "형식 미지정 응답"}을 받았습니다.`);
    }
    csvText = await res.text();
    console.log(`✅ Google Sheets CSV 응답 확인 (gid=${SHEET_GID}, HTTP ${res.status})`);
  } catch (err) {
    console.error(`❌ CSV 가져오기 실패 (gid=${SHEET_GID}):`, err.message);
    const fallbackPath = path.join(__dirname, "..", "data", "posts.json");
    if (!fs.existsSync(fallbackPath)) throw new Error("data/posts.json도 없습니다.");

    const cachedPosts = JSON.parse(fs.readFileSync(fallbackPath, "utf-8"));
    const posts = normalizePosts(cachedPosts);
    if (posts.some((post, index) => post !== cachedPosts[index])) {
      savePosts(posts);
    } else {
      generateRss(posts);
    }
    console.log(`⚠️ 기존 캐시 사용 (${posts.length}개 포스트)`);
    return;
  } finally {
    clearTimeout(timeout);
  }

  const posts = processCsv(csvText);
  if (posts.length === 0) throw new Error("CSV에 게시글이 없습니다.");
  savePosts(posts);
}

if (require.main === module) {
  main().catch((err) => {
    console.error("❌ 콘텐츠 준비 실패:", err.message);
    process.exitCode = 1;
  });
}

module.exports = { processCsv, savePosts };
