<script>
import { computed, onMounted, onUnmounted, nextTick, watch, ref } from 'vue';

import {useRoute} from 'vue-router';
import snapshots from '../data/articles.json' with {type:'json'};
import {fetchArticle} from '../api/articleClient.js';
import {assetUrl} from '../api/assetUrl.js';
import PdfReader from '../components/PdfReader.vue';
import {updateArticleMeta} from '../api/articleMeta.js';
const JOURNAL = 'The International Journal of Intelligent Control and Systems';
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_IEEE = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

function adaptArticle(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const authors = Array.isArray(raw.authors) ? raw.authors.filter(Boolean) : [];
  const keywords = Array.isArray(raw.keywords) ? raw.keywords.filter(Boolean) : [];
  return {
    id: raw.id,
    title: typeof raw.title === 'string' ? raw.title.trim() : '',
    doi: typeof raw.doi === 'string' ? raw.doi.trim() : '',
    abstract: typeof raw.abstract === 'string' ? raw.abstract.trim() : '',
    readCount: raw.readCount,
    downloadCount: raw.downloadCount,
    citationCount: raw.citationCount,
    category: typeof raw.category === 'string' ? raw.category.trim() : '',
    pdfSize: raw.pdfSize,
    pdfDownloadSize:raw.pdfDownloadSize,
    authors,
    keywords,
    volume: raw.volume,
    issue: raw.issue,
    pages: typeof raw.pages === 'string' ? raw.pages.trim() : raw.pages == null ? '' : String(raw.pages),
    published: typeof raw.published === 'string' ? raw.published.trim() : '',
    metricsAsOf: typeof raw.metricsAsOf === 'string' ? raw.metricsAsOf.trim() : '',
    figure: typeof raw.figure === 'string' ? raw.figure.trim() : '',
    figureCaption: typeof raw.figureCaption === 'string' ? raw.figureCaption.trim() : '',
    pdfUrl: typeof raw.pdfUrl === 'string' ? raw.pdfUrl.trim() : '',
    browseUrl: typeof raw.browseUrl === 'string' ? raw.browseUrl.trim() : '',
    references: raw.references,
    authorDetails: raw.authorDetails || []
  };
}

function parseIsoDate(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).slice(0, 10));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

function formatLongDate(value) {
  const parsed = parseIsoDate(value);
  if (!parsed) return '';
  return `${parsed.day} ${MONTHS_LONG[parsed.month - 1]} ${parsed.year}`;
}

function formatMetric(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return number;
}

function formatBytes(bytes) {
  const number = Number(bytes);
  if (!Number.isFinite(number) || number < 0) return '';
  const mb = number / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function splitName(fullName) {
  if (typeof fullName === 'object' && /Editorial Office|Editorial Board|Consortium|Committee|Working Group/i.test(fullName.name||'')) return {family:fullName.name,given:[]};
  if (typeof fullName === 'object') return {family: fullName.family || fullName.name || '',given:(fullName.given || '').split(/\s+/).filter(Boolean)};
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { family: '', given: [] };
  if (parts.length === 1) return { family: parts[0], given: [] };
  return { family: parts[parts.length - 1], given: parts.slice(0, -1) };
}

function toInitials(given) {
  return given.map(part=>part.split('-').map(piece=>`${piece.charAt(0).toUpperCase()}.`).join('-')).join(' ');
}

function ieeeAuthors(authors) {
  const formatted = authors.map((name) => {
    const { family, given } = splitName(name);
    const initials = toInitials(given);
    return initials ? `${initials} ${family}` : family;
  });
  if (formatted.length === 0) return '';
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;
}

function apaAuthors(authors) {
  const formatted = authors.map((name) => {
    const { family, given } = splitName(name);
    const initials = toInitials(given);
    return initials ? `${family}, ${initials}` : family;
  });
  if (formatted.length === 0) return '';
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]}, & ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`;
}

function pageParts(pages) {
  const text = String(pages || '');
  const parts = text.split(/\s*[–—-]\s*/);
  return {
    start: parts[0] || '',
    end: parts[1] || parts[0] || ''
  };
}

function buildIeee(article) {
  const parsed = parseIsoDate(article.published);
  const month = parsed ? MONTHS_IEEE[parsed.month - 1] : '';
  const year = parsed ? String(parsed.year) : '';
  const who = ieeeAuthors(article.authorDetails?.length ? article.authorDetails : article.authors);
  const pages = article.pages ? `, pp. ${article.pages}` : '';
  const vol = article.volume != null && article.volume !== '' ? `, vol. ${article.volume}` : '';
  const issue = article.issue != null && article.issue !== '' ? `, no. ${article.issue}` : '';
  const datePart = [month, year].filter(Boolean).join(' ');
  const doi = article.doi ? `, doi: ${article.doi}` : '';
  return `${who}, "${article.title}," ${JOURNAL}${vol}${issue}${pages}${datePart ? `, ${datePart}` : ''}${doi}.`;
}

function buildApa(article) {
  const parsed = parseIsoDate(article.published);
  const year = parsed ? parsed.year : '';
  const who = apaAuthors(article.authorDetails?.length ? article.authorDetails : article.authors);
  const vol = article.volume != null && article.volume !== '' ? String(article.volume) : '';
  const issue = article.issue != null && article.issue !== '' ? `(${article.issue})` : '';
  const pages = article.pages ? `, ${article.pages}` : '';
  const doi = article.doi ? ` https://doi.org/${article.doi}` : '';
  const issueBlock = vol ? `, ${vol}${issue}${pages}` : pages;
  return `${who} (${year}). ${article.title}. ${JOURNAL}${issueBlock}.${doi}`;
}

function buildBibtex(article) {
  const parsed = parseIsoDate(article.published);
  const year = parsed ? parsed.year : '';
  const month = parsed ? MONTHS_LONG[parsed.month - 1].slice(0, 3).toLowerCase() : '';
  const first = splitName(article.authorDetails?.[0] || article.authors[0] || '').family || 'Article';
  const key = `${first}${year}IJICS${article.id}`;
  const authors = (article.authorDetails?.length ? article.authorDetails : article.authors).map((name) => {
    const { family, given } = splitName(name);
    return given.length ? `${family}, ${given.join(' ')}` : family;
  }).join(' and ');
  const pages = String(article.pages || '').replace(/[–—]/g, '--');
  const lines = [
    `@article{${key},`,
    `  author = {${authors}},`,
    `  title = {${article.title}},`,
    `  journal = {${JOURNAL}},`
  ];
  if (year) lines.push(`  year = {${year}},`);
  if (article.volume != null && article.volume !== '') lines.push(`  volume = {${article.volume}},`);
  if (article.issue != null && article.issue !== '') lines.push(`  number = {${article.issue}},`);
  if (pages) lines.push(`  pages = {${pages}},`);
  if (month) lines.push(`  month = ${month},`);
  if (article.doi) lines.push(`  doi = {${article.doi}}`);
  const last = lines.length - 1;
  if (last > 0 && !lines[last].endsWith(',')) {
    /* keep last field without trailing comma */
  }
  lines.push('}');
  return lines.join('\n');
}

function buildRis(article) {
  const parsed = parseIsoDate(article.published);
  const pages = pageParts(article.pages);
  const lines = ['TY  - JOUR'];
  (article.authorDetails?.length ? article.authorDetails : article.authors).forEach((name) => {
    const { family, given } = splitName(name);
    lines.push(given.length ? `AU  - ${family}, ${given.join(' ')}` : `AU  - ${family}`);
  });
  if (article.title) lines.push(`TI  - ${article.title}`);
  lines.push(`T2  - ${JOURNAL}`);
  if (parsed) {
    lines.push(`PY  - ${parsed.year}`);
    lines.push(`DA  - ${parsed.year}/${String(parsed.month).padStart(2, '0')}/${String(parsed.day).padStart(2, '0')}`);
  }
  if (article.volume != null && article.volume !== '') lines.push(`VL  - ${article.volume}`);
  if (article.issue != null && article.issue !== '') lines.push(`IS  - ${article.issue}`);
  if (pages.start) lines.push(`SP  - ${pages.start}`);
  if (pages.end) lines.push(`EP  - ${pages.end}`);
  if (article.doi) lines.push(`DO  - ${article.doi}`);
  if (article.doi) lines.push(`UR  - https://doi.org/${article.doi}`);
  lines.push('ER  - ');
  return lines.join('\n');
}

export default {
  components:{PdfReader},
  setup() {
    const route=useRoute();
    const initial=snapshots.find(a=>String(a.id)===String(route.params.id));
    const loadState = ref(initial?'ready':import.meta.env.SSR?'error':'loading');
    const refreshWarning=ref('');
    let requestId=0,controller;
    const loadError = ref(initial?'':'Article not found.');
    const article = ref(initial?adaptArticle(initial):null);
    const citeFormat = ref('ieee');
    const copyStatus = ref('');
    let copyTimer = 0;

    const authorsText = computed(() => (article.value?.authors || []).join(', '));
    const doiHref = computed(() => (article.value?.doi ? `https://doi.org/${article.value.doi}` : ''));
    const publishedLabel = computed(() => formatLongDate(article.value?.published));
    const metricsAsOfLabel = computed(() => formatLongDate(article.value?.metricsAsOf));
    const pdfSizeLabel = computed(() => formatBytes(article.value?.pdfDownloadSize));
    const volumeIssueLabel = computed(() => {
      if (!article.value) return '';
      const parts = [];
      if (article.value.volume != null && article.value.volume !== '') parts.push(`Vol. ${article.value.volume}`);
      if (article.value.issue != null && article.value.issue !== '') parts.push(`No. ${article.value.issue}`);
      return parts.join(', ');
    });
    const issueLine = computed(() => {
      const bits = [volumeIssueLabel.value, article.value?.pages ? `pp. ${article.value.pages}` : ''].filter(Boolean);
      return bits.join(', ');
    });
    const citationText = computed(() => {
      if (!article.value) return '';
      if (citeFormat.value === 'apa') return buildApa(article.value);
      if (citeFormat.value === 'bibtex') return buildBibtex(article.value);
      if (citeFormat.value === 'ris') return buildRis(article.value);
      return buildIeee(article.value);
    });

    function metricLabel(value) {
      const number = formatMetric(value);
      return number === null ? 'Unavailable' : String(number);
    }

    async function loadArticle() {
      if(!import.meta.env.SSR){document.getElementById('cite-dialog')?.close();document.getElementById('figure-dialog')?.close();}
      const thisRequest=++requestId;controller?.abort();controller=new AbortController();
      const saved=snapshots.find(a=>String(a.id)===String(route.params.id));
      article.value=saved?adaptArticle(saved):null;loadState.value=saved?'ready':'loading';loadError.value='';refreshWarning.value='';
      try {
        const record=await fetchArticle(route.params.id,{signal:controller.signal});
        if(thisRequest!==requestId)return;
        const adapted=adaptArticle(record);if(!adapted?.title)throw new Error('Article title is unavailable.');
        article.value=adapted;loadState.value='ready';
      } catch(error) {
        if(thisRequest!==requestId || error.name==='AbortError')return;
        if(saved && error.status!==404){refreshWarning.value='Current article data is unavailable. Showing the dated record.';loadState.value='ready';}
        else {article.value=null;loadError.value=error.status===404?'Article not found.':'The article could not be loaded. Please try again.';loadState.value='error';}
      }
      if(!import.meta.env.SSR && article.value){updateArticleMeta(article.value);document.title=article.value.title+' | IJICS';const m=document.querySelector('meta[name="description"]');if(m)m.content=article.value.abstract.slice(0,200);}
      if(!import.meta.env.SSR && !article.value){updateArticleMeta(null);document.title='Article unavailable | IJICS';}
      if(!import.meta.env.SSR && route.query.cite && article.value){await nextTick();openCite();}
    }

    function openCite() {
      copyStatus.value = '';
      document.getElementById('cite-dialog')?.showModal();
    }

    function closeCite() {
      document.getElementById('cite-dialog')?.close();
    }

    function openFigure() {
      document.getElementById('figure-dialog')?.showModal();
    }

    function closeFigure() {
      document.getElementById('figure-dialog')?.close();
    }

    function onDialogBackdrop(event, close) {
      if (event.target === event.currentTarget) close();
    }

    function setCopyStatus(message) {
      copyStatus.value = message;
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => {
        copyStatus.value = '';
      }, 2400);
    }

    async function copyCitation() {
      const text = citationText.value;
      const area = document.getElementById('citationText');
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else if (area) {
          area.focus();
          area.select();
          if (!document.execCommand('copy')) throw new Error('Copy was not accepted.');
        } else {
          throw new Error('Clipboard is not available.');
        }
        setCopyStatus('Copied.');
      } catch (error) {
        if (area) {
          area.focus();
          area.select();
        }
        setCopyStatus('Copy failed. Select the text and copy it manually.');
      }
    }

    function downloadCitation() {
      if (!article.value) return;
      const isRis = citeFormat.value === 'ris';
      const filename = isRis ? `ijics-${article.value.id || 'article'}.ris` : `ijics-${article.value.id || 'article'}.bib`;
      const mime = isRis ? 'application/x-research-info-systems' : 'application/x-bibtex';
      const blob = new Blob([citationText.value], { type: `${mime};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setCopyStatus(isRis ? 'RIS file downloaded.' : 'BibTeX file downloaded.');
    }

    if(!import.meta.env.SSR)watch(()=>route.params.id,loadArticle,{immediate:true});
    watch(()=>route.query.cite,async value=>{if(value && article.value){await nextTick();openCite();}});
    onUnmounted(()=>{controller?.abort();clearTimeout(copyTimer)});

    return {
      refreshWarning,
      assetUrl,
      loadState,
      loadError,
      article,
      citeFormat,
      copyStatus,
      authorsText,
      doiHref,
      publishedLabel,
      metricsAsOfLabel,
      pdfSizeLabel,
      volumeIssueLabel,
      issueLine,
      citationText,
      metricLabel,
      loadArticle,
      openCite,
      closeCite,
      openFigure,
      closeFigure,
      onDialogBackdrop,
      copyCitation,
      downloadCitation
    };
  }
};

</script>
<template>
<main id="main">
      <div v-if="loadState === 'loading'" class="article-status" role="status">Loading article.</div>

      <div v-else-if="loadState === 'error'" class="article-status article-status-error" role="alert">
        <p>The article record could not be loaded.</p>
        <p>{{ loadError }}</p>
        <button type="button" class="btn-primary" @click="loadArticle">Try again</button>
      </div>

      <template v-else-if="article"><p v-if="refreshWarning" class="data-warning" role="status">{{refreshWarning}} <button type="button" @click="loadArticle">Try again</button></p>
        <header class="article-masthead">
          <div class="article-wrap">
            <p v-if="article.category" class="article-kicker">{{ article.category }}</p>
            <h1 class="article-title">{{ article.title }}</h1>
            <p v-if="authorsText" class="article-authors">{{ authorsText }}</p>
            <p class="article-byline">
              <a v-if="doiHref" class="article-doi" :href="doiHref" rel="noopener noreferrer">doi: {{ article.doi }}</a>
              <span v-if="issueLine">{{ issueLine }}</span>
              <span v-if="publishedLabel">{{ publishedLabel }}</span>
            </p>
          </div>
        </header>

        <div class="article-body">
          <div class="article-wrap article-layout">
            <div class="article-main">
              <nav class="section-nav" aria-label="On this page">
                <p class="section-nav-label">On this page</p>
                <ul>
                  <li v-if="article.abstract"><a href="#abstract">Abstract</a></li>
                  <li v-if="article.keywords.length"><a href="#keywords">Keywords</a></li>
                  <li v-if="article.figure"><a href="#figure">Figure</a></li>
                  <li><a href="#full-text">Full text</a></li>
                  <li v-if="article.authorDetails.some(a=>a.affiliations?.length)"><a href="#affiliations">Affiliations</a></li>
                  <li v-if="article.references?.length"><a href="#references">References</a></li>
                </ul>
              </nav>

              <section v-if="article.abstract" id="abstract" class="article-section" aria-labelledby="abstract-heading">
                <h2 id="abstract-heading">Abstract</h2>
                <p v-if="article.abstract" class="abstract-text">{{ article.abstract }}</p>
                <p v-else class="empty-record">No abstract is available for this article.</p>
              </section>

              <section v-if="article.keywords.length" id="keywords" class="article-section" aria-labelledby="keywords-heading">
                <h2 id="keywords-heading">Keywords</h2>
                <ul v-if="article.keywords.length" class="keyword-list">
                  <li v-for="word in article.keywords" :key="word">{{ word }}</li>
                </ul>
                <p v-else class="empty-record">No keywords are available.</p>
              </section>

              <section v-if="!article.abstract && article.browseUrl" id="full-text" class="article-section" aria-labelledby="report-text-heading"><h2 id="report-text-heading">Full text</h2><PdfReader :url="article.browseUrl" :title="article.title"/></section>
              <section v-if="article.figure" id="figure" class="article-section" aria-labelledby="figure-heading">
                <h2 id="figure-heading">Figure</h2>
                <figure v-if="article.figure" class="figure-panel">
                  <button type="button" class="figure-zoom-trigger" @click="openFigure" aria-label="Enlarge figure">
                    <img :src="assetUrl(article.figure)" :alt="article.figureCaption || 'Article figure'" width="1600" height="900" />
                  </button>
                  <figcaption v-if="article.figureCaption">{{ article.figureCaption }}</figcaption>
                </figure>
                <p v-else class="empty-record">No figure is available for this article.</p>
              </section>

              <section v-if="article.abstract" id="full-text" class="article-section" aria-labelledby="full-text-heading">
                <h2 id="full-text-heading">Full text</h2>
                <PdfReader v-if="article.browseUrl" :url="article.browseUrl" :title="article.title"/>
                <p v-if="article.browseUrl || article.pdfUrl" class="empty-record-action">
                  <a v-if="article.browseUrl" :href="article.browseUrl" rel="noopener noreferrer" target="_blank">View PDF</a>
                  <a v-if="article.pdfUrl" :href="article.pdfUrl" rel="noopener noreferrer">Download PDF</a>
                </p>
              </section>

              <section v-if="article.authorDetails.some(a=>a.affiliations?.length)" id="affiliations" class="article-section" aria-labelledby="affiliations-heading">
                <h2 id="affiliations-heading">Affiliations</h2>
                <dl class="metadata-list"><div v-for="author in article.authorDetails.filter(a=>a.affiliations?.length)" :key="author.name"><dt>{{author.name}}</dt><dd>{{author.affiliations.join("; ")}}</dd></div></dl>
              </section>

              <section v-if="article.references?.length" id="references" class="article-section" aria-labelledby="references-heading">
                <h2 id="references-heading">References</h2>
                <ol v-if="Array.isArray(article.references)" class="reference-list"><li v-for="(reference,index) in article.references" :key="index">{{typeof reference==="string"?reference:(reference.text || [reference.authors?.join(", "),reference.title,reference.year,reference.doi].filter(Boolean).join(". "))}}</li></ol><p v-else>{{article.references}}</p>
              </section>
            </div>

            <aside class="article-aside">
              <section class="publication-card" aria-label="Publication, metrics, and citation">
                <h2 class="card-heading">Publication</h2>
                <dl class="fact-list">
                  <div v-if="article.category">
                    <dt>Collection</dt>
                    <dd>{{ article.category }}</dd>
                  </div>
                  <div v-if="volumeIssueLabel">
                    <dt>Issue</dt>
                    <dd>{{ volumeIssueLabel }}</dd>
                  </div>
                  <div v-if="article.pages">
                    <dt>Pages</dt>
                    <dd>{{ article.pages }}</dd>
                  </div>
                  <div v-if="publishedLabel">
                    <dt>Published</dt>
                    <dd><time :datetime="article.published">{{ publishedLabel }}</time></dd>
                  </div>
                  <div v-if="article.doi">
                    <dt>DOI</dt>
                    <dd><a :href="doiHref" rel="noopener noreferrer">{{ article.doi }}</a></dd>
                  </div>
                </dl>

                <h2 class="card-heading">Metrics</h2>
                <p v-if="metricsAsOfLabel" class="metrics-as-of">Counts as of <time class="metrics-time" :datetime="article.metricsAsOf">{{ metricsAsOfLabel }}</time></p>
                <dl class="metrics-list">
                  <div>
                    <dt>Reads</dt>
                    <dd>{{ metricLabel(article.readCount) }}</dd>
                  </div>
                  <div>
                    <dt>Downloads</dt>
                    <dd>{{ metricLabel(article.downloadCount) }}</dd>
                  </div>
                  <div>
                    <dt>Citations received</dt>
                    <dd>{{ metricLabel(article.citationCount) }}</dd>
                  </div>
                </dl>

                <div class="detail-actions">
                  <button type="button" class="btn-secondary" @click="openCite">Cite this article</button>
                  <a v-if="article.browseUrl" class="btn-secondary" :href="article.browseUrl" rel="noopener noreferrer" target="_blank">View PDF</a>
                  <a v-if="article.pdfUrl" class="btn-primary" :href="article.pdfUrl" rel="noopener noreferrer">
                    Download PDF<span v-if="pdfSizeLabel"> ({{ pdfSizeLabel }})</span>
                  </a>
                </div>
              </section>
            </aside>
          </div>
        </div>

        <dialog id="cite-dialog" class="cite-dialog" aria-labelledby="cite-dialog-title" @click="onDialogBackdrop($event, closeCite)">
          <div class="dialog-panel">
            <header class="dialog-header">
              <h2 id="cite-dialog-title">Cite this article</h2>
              <button type="button" class="dialog-close" @click="closeCite" aria-label="Close citation dialog">Close</button>
            </header>
            <p class="dialog-lead">Choose a citation format.</p>
            <div class="cite-tabs" role="tablist" aria-label="Citation format">
              <button type="button" role="tab" id="tab-ieee" :aria-selected="citeFormat === 'ieee'" aria-controls="citation-panel" @click="citeFormat = 'ieee'">IEEE</button>
              <button type="button" role="tab" id="tab-apa" :aria-selected="citeFormat === 'apa'" aria-controls="citation-panel" @click="citeFormat = 'apa'">APA</button>
              <button type="button" role="tab" id="tab-bibtex" :aria-selected="citeFormat === 'bibtex'" aria-controls="citation-panel" @click="citeFormat = 'bibtex'">BibTeX</button>
              <button type="button" role="tab" id="tab-ris" :aria-selected="citeFormat === 'ris'" aria-controls="citation-panel" @click="citeFormat = 'ris'">RIS</button>
            </div>
            <div id="citation-panel" class="cite-panel" role="tabpanel" :aria-labelledby="'tab-' + citeFormat">
              <label class="visually-hidden" for="citationText">Citation text</label>
              <textarea id="citationText" readonly rows="10" :value="citationText"></textarea>
            </div>
            <div class="dialog-actions">
              <button type="button" class="btn-primary" @click="copyCitation">Copy</button>
              <button v-if="citeFormat === 'bibtex' || citeFormat === 'ris'" type="button" class="btn-secondary" @click="downloadCitation">Download {{ citeFormat === 'bibtex' ? 'BibTeX' : 'RIS' }}</button>
            </div>
            <p class="copy-status" role="status" aria-live="polite">{{ copyStatus }}</p>
          </div>
        </dialog>

        <dialog id="figure-dialog" class="figure-dialog" aria-labelledby="figure-dialog-title" @click="onDialogBackdrop($event, closeFigure)">
          <div class="dialog-panel">
            <header class="dialog-header">
              <h2 id="figure-dialog-title">{{ article.figureCaption || 'Figure' }}</h2>
              <button type="button" class="dialog-close" @click="closeFigure" aria-label="Close figure">Close</button>
            </header>
            <img v-if="article.figure" class="figure-dialog-image" :src="assetUrl(article.figure)" :alt="article.figureCaption || 'Article figure'" />
          </div>
        </dialog>
      </template>
    </main>
</template>
