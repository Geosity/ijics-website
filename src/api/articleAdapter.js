import {decodeHTML} from 'entities';
import snapshots from '../data/articles.json' with { type: 'json' };

const SOURCE_BASE = 'https://www.ijics.cn/api/ijics/article';

function unwrap(raw) {
  if (
    raw &&
    typeof raw === 'object' &&
    raw.data &&
    typeof raw.data === 'object' &&
    !Array.isArray(raw.data)
  ) {
    return raw.data;
  }
  return raw;
}

function stripTags(text) {
 if(text==null)return null;
 const plain=decodeHTML(String(text).replace(/<script[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<\/(?:p|div|li|br)>/gi,' ').replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
 return plain||null;
}

function nonnegative(value) {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return typeof value!=='boolean' && Number.isFinite(n) && n >= 0 ? n : null;
}

function asScalar(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function displayName(author) {
 if(author==null)return '';
 if(typeof author==='string')return stripTags(author)||'';
 return stripTags(author.preferredName || author.name || author.displayName || [author.firstName||author.given,author.lastName||author.family].filter(Boolean).join(' '))||'';
}
function authorDetail(author) {
 const name=displayName(author);if(!name)return null;
 if(typeof author==='string')return {name,given:'',family:name,isCorresponding:false};
 const affiliations=Array.isArray(author.affiliations)?author.affiliations.map(stripTags).filter(Boolean):(author.institutions||[]).map(i=>[i.department,i.institution].filter(x=>typeof x==='string'&&x.trim()).map(stripTags).join(', ')).filter(Boolean);
 return {name,given:stripTags(author.firstName||author.given)||'',family:stripTags(author.lastName||author.family)||name,isCorresponding:Boolean(author.isCorrespondingAuthor||author.isCorresponding),affiliations:[...new Set(affiliations)]};
}
function normalizeReferences(value){
 if(!Array.isArray(value))return typeof value==='string'?stripTags(value):null;
 return value.map(ref=>typeof ref==='string'?stripTags(ref):{title:stripTags(ref.title),authors:Array.isArray(ref.authors)?ref.authors.map(displayName):[],year:ref.year,doi:stripTags(ref.doi),text:stripTags(ref.text)}).filter(Boolean);
}

function keywordName(keyword) {
  if (keyword == null) return '';
  if (typeof keyword === 'string') return keyword.trim();
  return String(keyword.name ?? keyword.keyword ?? keyword.label ?? keyword.value ?? '').trim();
}

function formatPages(start, end) {
  const a = start == null || start === '' ? null : start;
  const b = end == null || end === '' ? null : end;
  if (a == null && b == null) return null;
  if (a != null && b != null && String(a) !== String(b)) return `${a}–${b}`;
  return String(a ?? b);
}

function ymd(value) {
  if (value == null || value === '') return null;
  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value.toISOString().slice(0, 10) : null;
  }
  const s = String(value);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : s;
}

function categoryOf(article) {
  const c = article.category;
  if (c == null) return null;
  if (typeof c === 'string') return c;
  return c.name ?? c.title ?? c.categoryName ?? null;
}

function snapshotList() {
  if (Array.isArray(snapshots)) return snapshots;
  if (Array.isArray(snapshots?.default)) return snapshots.default;
  if (Array.isArray(snapshots?.articles)) return snapshots.articles;
  return [];
}

function snapshotOf(id) {
  if (id == null) return null;
  return snapshotList().find((item) => item.id === id || item.id === Number(id)) ?? null;
}

function usableFigure(value) {
  return typeof value === 'string' && value.trim() !== '';
}

export function normalizeArticle(raw, { asOf = new Date().toISOString() } = {}) {
  if (raw == null) return null;
  const article = unwrap(raw);
  if (article == null || typeof article !== 'object') return null;

  const id = article.id ?? null;
  const snap = snapshotOf(id);
  const issueWrap = article.issueArticle;
  const issueObj =
    issueWrap && typeof issueWrap.issue === 'object' && issueWrap.issue
      ? issueWrap.issue
      : article.issue && typeof article.issue === 'object'
        ? article.issue
        : null;

  const volume = asScalar(article.volume ?? issueObj?.volume);
  const issue =
    typeof article.issue === 'number' || typeof article.issue === 'string'
      ? asScalar(article.issue)
      : asScalar(issueObj?.number);

  const pageStart = article.pageStart ?? issueWrap?.pageStart ?? null;
  const pageEnd = article.pageEnd ?? issueWrap?.pageEnd ?? null;
  const pages = article.pages ?? formatPages(pageStart, pageEnd);
  const published =
    article.published ?? ymd(issueObj?.date) ?? ymd(article.publishDate) ?? ymd(article.pubDate) ?? null;

  const authorList = Array.isArray(article.authors) ? [...article.authors].sort((a,b)=>(a.sequence||0)-(b.sequence||0)) : [];
  const detailList = Array.isArray(article.authorDetails) ? article.authorDetails : authorList;
  const authorDetails = detailList.map(authorDetail).filter(Boolean);
  const authors = (authorList.length ? authorList.map(displayName) : authorDetails.map((d) => d.name)).filter(
    Boolean
  );
  const keywords = (Array.isArray(article.keywords) ? article.keywords : []).map(keywordName).filter(Boolean);

  const figure = usableFigure(article.figure)
    ? article.figure
    : usableFigure(snap?.figure)
      ? snap.figure
      : null;
  const figureCaption = article.figureCaption ?? snap?.figureCaption ?? null;

  return {
    id,
    title: stripTags(article.title),
    doi: stripTags(article.doi),
    abstract: stripTags(article.abstract ?? article.abstractEn ?? article.abstractCn),
    readCount: nonnegative(article.readCount ?? article.read_count),
    downloadCount: nonnegative(article.downloadCount ?? article.download_count),
    citationCount: nonnegative(article.citationCount ?? article.citation_count),
    category: categoryOf(article),
    pdfSize: nonnegative(article.pdfSize ?? article.pdf_size),
    authors,
    authorDetails,
    keywords,
    volume,
    issue,
    issueId: asScalar(article.issueId ?? issueObj?.id ?? issueWrap?.issueID),
    earlyAccess:Boolean(article.earlyAccess),
    pages,
    published,
    metricsAsOf: article.metricsAsOf || asOf,
    figure,
    figureCaption,
    source: id == null ? null : `${SOURCE_BASE}/detail/${id}`,
    references: normalizeReferences(article.references),
    pdfUrl: id == null ? null : `${SOURCE_BASE}/download/${id}`,
    browseUrl: id == null ? null : `${SOURCE_BASE}/browse/${id}`,
  };
}
