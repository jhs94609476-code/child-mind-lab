// 저장해 둔 content.md(처음 8줄은 메타데이터) 또는 CSV를 사용합니다.
const fs = require("node:fs");
const path = require("node:path");
const { processCsv, savePosts } = require("./fetch-data");
const { normalizePosts } = require("./normalize-banner-markers");

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    const cached = path.join(__dirname, "..", "data", "posts.json");
    const posts = normalizePosts(JSON.parse(fs.readFileSync(cached, "utf-8")));
    savePosts(posts);
    return;
  }

  const source = fs.readFileSync(inputPath, "utf-8");
  const csv = path.extname(inputPath).toLowerCase() === ".md"
    ? source.split(/\r?\n/).slice(8).join("\n")
    : source;
  const posts = processCsv(csv);
  if (posts.length === 0) throw new Error("캐시 파일에 게시글이 없습니다.");
  savePosts(posts);
}

try {
  main();
} catch (err) {
  console.error("❌ 캐시 복구 실패:", err.message);
  process.exitCode = 1;
}
