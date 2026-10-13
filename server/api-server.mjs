import {normalizeArticle} from '../src/api/articleAdapter.js';
import {filterArticles as selectArticles} from '../src/api/articleFilters.js';
import http from "node:http";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import snapshots from "../src/data/articles.json" with { type: "json" };

const HOST = "127.0.0.1";
const PORT = 4181;
const OFFICIAL_DETAIL = "https://www.ijics.cn/api/ijics/article/detail/";
const OFFICIAL_PDF = "https://www.ijics.cn/api/ijics/article/download/";
const OFFICIAL_BROWSE = "https://www.ijics.cn/api/ijics/article/browse/";

const PUBLIC_KEYS = [
  "id", "title", "doi", "abstract", "readCount", "downloadCount", "citationCount",
  "category", "pdfSize", "authors", "authorDetails", "keywords", "volume", "issue",
  "pages", "published", "metricsAsOf", "figure", "figureCaption", "source", "issueId", "earlyAccess", "pdfDownloadSize",
  "references", "pdfUrl", "browseUrl",
];

const SNAPSHOT_META = ['figure','figureCaption'];

function send(res, status, body, extra) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET",
    ...extra,
  });
  res.end(JSON.stringify(body));
}

function toNum(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function names(list) {
  if (!Array.isArray(list)) return [];
  return list.map((x) => (typeof x === "string" ? x : x?.name)).filter(Boolean);
}

function scrubDetails(details) {
 if(!Array.isArray(details))return [];
 return details.map(d=>typeof d==='string'?{name:d}:{name:d.name,given:d.given,family:d.family,isCorresponding:Boolean(d.isCorresponding),affiliations:Array.isArray(d.affiliations)?d.affiliations.filter(x=>typeof x==='string'):[]});
}

function publicArticle(article) {
  const out = {};
  for (const key of PUBLIC_KEYS) {
    if (article[key] !== undefined) out[key] = article[key];
  }
  if (out.authorDetails) out.authorDetails = scrubDetails(out.authorDetails);
  return out;
}

function filterArticles(list, query) {
 return selectArticles(list,{q:query.get('q')||'',type:query.get('type')||'all',issue:query.get('issue')||''}).map(publicArticle);
}

function unwrap(body) {
  if (!body || typeof body !== "object") return null;
  let d = body;
  if (d.data && typeof d.data === "object" && !Array.isArray(d.data)) d = d.data;
  if (d.article && typeof d.article === "object" && !Array.isArray(d.article)) d = d.article;
  return d;
}


function mergeLocal(live, local) {
  if (!local) return live;
  const out = { ...live };
  for (const key of SNAPSHOT_META) {
    if (out[key] == null && local[key] != null) out[key] = local[key];
  }
  return out;
}

async function loadLive(id, local, fetchImpl) {
  const url = `${OFFICIAL_DETAIL}${id}`;
  const res = await fetchImpl(url, {
    method: "GET",
    redirect: "manual",
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (res.status === 404) return { status: 404 };
  if (!res.ok) return { status: 502 };
  const body = await res.json();
  const raw = unwrap(body);
  const normalized=normalizeArticle(raw,{asOf:new Date().toISOString()});
  if(!normalized?.title)return {status:404};
  if(Number(normalized.id)!==id)return {status:502};
  return {status:200,article:mergeLocal(normalized,local)};

}

function isCli() {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return fileURLToPath(import.meta.url) === resolve(entry);
  } catch {
    return false;
  }
}

export function createApiServer({
  mode = "fixture",
  articles = snapshots,
  fetchImpl = fetch,
} = {}) {
  if(!['live','fixture'].includes(mode))throw new Error('Unknown API mode');
  const resolved=mode;
  const catalog = Array.isArray(articles)
    ? articles
    : Array.isArray(articles?.articles)
      ? articles.articles
      : [];
  const byId = new Map(catalog.map((a) => [Number(a.id), a]));

  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", "http://127.0.0.1");
      const path = url.pathname.replace(/\/+$/, "") || "/";
      const query = url.searchParams;
      const method = (req.method || "GET").toUpperCase();
      const articleMatch = path.match(/^\/api\/articles\/([^/]+)(?:\/(metrics))?$/);
      const isHealth = path === "/api/health";
      const isList = path === "/api/articles";
      if (!isHealth && !isList && !articleMatch) {
        return send(res, 404, { error: "not_found" });
      }
      if (method !== "GET") {
        return send(res, 405, { error: "method_not_allowed" }, { allow: "GET" });
      }
      if (resolved === "fixture" && query.get("scenario") === "error") {
        return send(res, 503, { error: "unavailable" });
      }
      if (isHealth) return send(res, 200, { ok: true, mode: resolved });
      if (isList) {
        if (resolved === "fixture" && query.get("scenario") === "empty") {
          return send(res, 200, { data: [], meta:{mode:resolved,asOf:null} });
        }
        return send(res, 200, { data: filterArticles(catalog, query), meta:{mode:"snapshot",asOf:catalog[0]?.metricsAsOf||null} });
      }
      const idRaw = articleMatch[1];
      if (!/^[1-9]\d*$/.test(idRaw)) return send(res, 404, { error: "not_found" });
      const id = Number(idRaw);
      if(!Number.isSafeInteger(id))return send(res,404,{error:"not_found"});
      const local = byId.get(id);
      let article = local ? { ...local } : null;
      if (resolved === "live") {
        const loaded = await loadLive(id, local, fetchImpl);
        if (loaded.status !== 200) {
          return send(res, loaded.status, {
            error: loaded.status === 404 ? "not_found" : "upstream_unavailable",
          });
        }
        article = loaded.article;
      } else if (!article) {
        return send(res, 404, { error: "not_found" });
      }
      if (resolved === "fixture" && query.get("scenario") === "null-metrics") {
        article = { ...article, readCount: null, downloadCount: null, citationCount: null };
      }
      if (articleMatch[2] === "metrics") {
        return send(res, 200, {
          data: {
            id:article.id,
            readCount: article.readCount ?? null,
            downloadCount: article.downloadCount ?? null,
            citationCount: article.citationCount ?? null,
            metricsAsOf: article.metricsAsOf ?? null,
          },
        });
      }
      return send(res, 200, { data: publicArticle(article),meta:{mode:resolved,asOf:article.metricsAsOf||null} });
    } catch {
      return send(res, resolved === "live" ? 502 : 500, {
        error: resolved === "live" ? "upstream_unavailable" : "internal",
      });
    }
  });
}

if (isCli()) {
  const mode = process.env.IJICS_API_MODE === "live" ? "live" : "fixture";
  createApiServer({ mode }).listen(PORT, HOST);
}
