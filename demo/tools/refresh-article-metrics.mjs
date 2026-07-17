import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(scriptDirectory, "../index.html");
const apiRoot = "https://www.ijics.cn/api/ijics/article/detail";

let html = await readFile(indexPath, "utf8");
const articleIds = [...html.matchAll(/data-article-metrics="(\d+)"/g)].map((match) => match[1]);

if (!articleIds.length) {
  throw new Error("No homepage article metric blocks found.");
}

const results = await Promise.allSettled(
  articleIds.map(async (articleId) => {
    const response = await fetch(`${apiRoot}/${articleId}`, {
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Article ${articleId}: HTTP ${response.status}`);
    }
    const payload = await response.json();
    const article = payload.data ?? payload;
    if (!Number.isFinite(article.readCount) || !Number.isFinite(article.downloadCount)) {
      throw new Error(`Article ${articleId}: metric fields missing`);
    }
    return {
      articleId,
      readCount: article.readCount,
      downloadCount: article.downloadCount,
    };
  }),
);

let updated = 0;
for (const result of results) {
  if (result.status === "rejected") {
    console.warn(result.reason.message);
    continue;
  }

  const { articleId, readCount, downloadCount } = result.value;
  const blockPattern = new RegExp(
    `(data-article-metrics="${articleId}"[\\s\\S]*?data-metric="read">)\\d+(</strong>[\\s\\S]*?data-metric="download">)\\d+(</strong>)`,
  );
  html = html.replace(blockPattern, `$1${readCount}$2${downloadCount}$3`);
  updated += 1;
}

if (!updated) {
  throw new Error("Official article metrics could not be refreshed.");
}

await writeFile(indexPath, html);
console.log(`Refreshed official usage metrics for ${updated}/${articleIds.length} homepage articles.`);
