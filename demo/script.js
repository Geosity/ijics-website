const toast = document.querySelector("#toast");
const quickAccessFloat = document.querySelector("#site-structure");
const quickAccessClose = document.querySelector(".quick-access-close");
const issueSelect = document.querySelector("#issueSelect");
const articleTypeButtons = document.querySelectorAll("[data-article-type]");
const articleQuery = document.querySelector("#articleQuery");
const navigationBoard = document.querySelector(".navigation-board");
const headerSearchLinks = Array.from(
  document.querySelectorAll('.section-shortcuts a[href*="search-articles"]')
);
const articleCards = Array.from(document.querySelectorAll(".article-card"));
const issueCards = Array.from(document.querySelectorAll("[data-issue-card]"));
const issueYearButtons = document.querySelectorAll("[data-issue-year]");
const issueArchiveList = document.querySelector("#issueArchiveList");
const issueYearFilter = document.querySelector(".issue-year-filter");
const selectedIssueCover = document.querySelector("#selectedIssueCover");
const selectedIssueCoverLink = document.querySelector("#selectedIssueCoverLink");
const selectedIssueTitle = document.querySelector("#all-issues-title");
const selectedIssueMeta = document.querySelector("#selectedIssueMeta");
const selectedIssueLink = document.querySelector("#selectedIssueLink");
const signaturePaperList = document.querySelector("#signaturePaperList");
const featureCarousel = document.querySelector(".feature-carousel");
const featureTrack = document.querySelector("#featureTrack");
const featureSlides = Array.from(document.querySelectorAll(".feature-slide"));
const featureButtons = Array.from(document.querySelectorAll("[data-feature-slide]"));
const citationDialog = document.querySelector("#citationDialog");
const citationDialogArticle = document.querySelector("#citationDialogArticle");
const citationFormatButtons = Array.from(document.querySelectorAll("[data-citation-format]"));
const currentPageName = window.location.pathname.split("/").pop() || "index.html";
let activeArticleType = "all";
let toastTimer;
let activeCitation;

if (featureCarousel && featureTrack && featureSlides.length > 1) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeFeature = 0;
  let featureTimer;

  const showFeature = (nextIndex) => {
    activeFeature = (nextIndex + featureSlides.length) % featureSlides.length;
    featureTrack.style.transform = `translateX(-${activeFeature * 100}%)`;
    featureSlides.forEach((slide, index) => {
      const hidden = index !== activeFeature;
      slide.setAttribute("aria-hidden", String(hidden));
      slide.inert = hidden;
    });
    featureButtons.forEach((button, index) => {
      const active = index === activeFeature;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const stopFeatureRotation = () => clearInterval(featureTimer);
  const startFeatureRotation = () => {
    stopFeatureRotation();
    if (reduceMotion.matches) return;
    featureTimer = setInterval(() => showFeature(activeFeature + 1), 12000);
  };

  featureButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showFeature(Number(button.dataset.featureSlide));
      startFeatureRotation();
    });
  });
  featureCarousel.addEventListener("mouseenter", stopFeatureRotation);
  featureCarousel.addEventListener("mouseleave", startFeatureRotation);
  featureCarousel.addEventListener("focusin", stopFeatureRotation);
  featureCarousel.addEventListener("focusout", startFeatureRotation);
  reduceMotion.addEventListener("change", startFeatureRotation);
  showFeature(0);
  startFeatureRotation();
}

document.querySelectorAll(".nav-menu").forEach((menu) => {
  let closeTimer;
  let animationTimer;
  const cancelClose = () => {
    clearTimeout(closeTimer);
    clearTimeout(animationTimer);
    menu.classList.remove("is-closing");
  };
  const closeMenu = () => {
    if (!menu.open) return;
    closeTimer = setTimeout(() => {
      if (menu.matches(":hover")) return;
      menu.classList.add("is-closing");
      animationTimer = setTimeout(() => {
        menu.open = false;
        menu.classList.remove("is-closing");
      }, 180);
    }, 700);
  };

  menu.addEventListener("mouseenter", cancelClose);
  menu.addEventListener("mouseleave", closeMenu);
  menu.addEventListener("focusin", cancelClose);
  menu.addEventListener("focusout", (event) => {
    if (!menu.contains(event.relatedTarget)) closeMenu();
  });
});

if (quickAccessFloat && quickAccessClose) {
  quickAccessClose.addEventListener("click", () => {
    quickAccessFloat.hidden = true;
  });
}

const issueTargets = {
  current: "./index.html#current-issue",
  forthcoming: "./forthcoming-issue.html#forthcoming-issue",
  archive: "./all-issues.html#all-issues",
  popular: "./index.html#articles",
  cfp: "./index.html#call-for-papers",
  authors: "./instructions-for-authors.html#instructions-for-authors",
};

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  }
}

function citationDetails(card) {
  const metricBlock = card.querySelector("[data-article-metrics]");
  const articleId = metricBlock?.dataset.articleMetrics || "";
  const title = card.querySelector("h2")?.textContent.trim() || "";
  const authorText = card.querySelector(".article-authors")?.textContent.trim() || "";
  const authors = authorText.split(",").map((author) => author.trim()).filter(Boolean);
  const pages = card.querySelector(".article-meta")?.textContent.match(/Pages\s+(\d+)-(\d+)/i);
  const pageRange = pages ? `${pages[1]}-${pages[2]}` : "";
  const doi = articleId ? `10.62678/IJICS202606.10${articleId}` : "";
  const keyAuthor = (authors[0] || "IJICS").split(/\s+/).at(-1).replace(/[^A-Za-z0-9]/g, "");
  const keyWord = (title.match(/[A-Za-z0-9]+/) || ["Article"])[0];

  return {
    title,
    authors,
    pageRange,
    doi,
    key: `${keyAuthor}2026${keyWord}`,
  };
}

function formatCitation(citation, format) {
  const authorList = citation.authors.join(", ");
  if (format === "apa") {
    return `${authorList}. (2026). ${citation.title}. International Journal of Intelligent Control and Systems, 31(2), ${citation.pageRange}. https://doi.org/${citation.doi}`;
  }
  if (format === "bibtex") {
    return `@article{${citation.key},
  author = {${citation.authors.join(" and ")}},
  title = {${citation.title}},
  journal = {International Journal of Intelligent Control and Systems},
  year = {2026},
  volume = {31},
  number = {2},
  pages = {${citation.pageRange}},
  doi = {${citation.doi}}
}`;
  }
  return `${authorList}, “${citation.title},” International Journal of Intelligent Control and Systems, vol. 31, no. 2, pp. ${citation.pageRange}, 2026, doi: ${citation.doi}.`;
}

document.querySelectorAll(".issue-article-card").forEach((card) => {
  const actions = card.querySelector(".article-actions");
  const metrics = card.querySelector(".article-metrics");
  if (actions && metrics) actions.appendChild(metrics);
});

document.addEventListener("click", (event) => {
  const citeButton = event.target.closest("[data-cite]");
  if (!citeButton || !citationDialog) return;
  const card = citeButton.closest(".issue-article-card");
  if (!card) return;
  activeCitation = citationDetails(card);
  if (citationDialogArticle) citationDialogArticle.textContent = activeCitation.title;
  citationDialog.showModal();
});

citationFormatButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (!activeCitation) return;
    const format = button.dataset.citationFormat;
    const copied = await copyText(formatCitation(activeCitation, format));
    if (copied) {
      citationDialog.close();
      showToast(`${button.querySelector("strong").textContent} citation copied`);
    } else {
      showToast("Citation copy unavailable");
    }
  });
});

function setHeaderSearchOpen(open) {
  if (!navigationBoard) return;

  navigationBoard.classList.toggle("is-open", open);
  headerSearchLinks.forEach((link) => {
    link.setAttribute("aria-expanded", String(open));
  });
  if (open && articleQuery) articleQuery.focus();
}

window.toggleHeaderSearch = function toggleHeaderSearch(event) {
  if (!navigationBoard) return;
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
  if (event) event.preventDefault();
  setHeaderSearchOpen(!navigationBoard.classList.contains("is-open"));
};

if (navigationBoard && headerSearchLinks.length) {
  if (!navigationBoard.id) navigationBoard.id = "headerSearchPanel";
  headerSearchLinks.forEach((link) => {
    link.setAttribute("aria-controls", navigationBoard.id);
    link.setAttribute("aria-expanded", "false");
    link.onclick = window.toggleHeaderSearch;
  });

  document.addEventListener("click", (event) => {
    const clickedSearchLink = headerSearchLinks.some((link) => link.contains(event.target));
    if (clickedSearchLink || navigationBoard.contains(event.target)) return;
    setHeaderSearchOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setHeaderSearchOpen(false);
  });
}

function scrollToTarget(target) {
  if (!target.startsWith("#")) {
    window.location.href = target;
    return;
  }
  const element = document.querySelector(target);
  if (!element) {
    window.location.href = `./index.html${target}`;
    return;
  }
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

const articleSearch = document.querySelector("#article-search");
if (articleSearch) {
  articleSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!articleCards.length && currentPageName !== "index.html") {
      const query = articleQuery ? articleQuery.value.trim() : "";
      const params = query ? `?q=${encodeURIComponent(query)}` : "";
      window.location.href = `./search-articles.html${params}#search-results`;
      return;
    }
    applyArticleFilters();
  });
}

function applyArticleFilters() {
  if (!articleCards.length) return;

  const query = articleQuery ? articleQuery.value.trim().toLowerCase() : "";
  let visible = 0;
  articleCards.forEach((card) => {
    const typeMatch = activeArticleType === "all" || card.dataset.articleGroup === activeArticleType;
    const searchText = card.dataset.search || card.textContent.toLowerCase();
    const queryMatch = !query || searchText.toLowerCase().includes(query);
    const match = typeMatch && queryMatch;
    card.classList.toggle("is-hidden", !match);
    if (match) visible += 1;
  });
  if (!visible) showToast("No article matches this issue");
}

if (articleQuery) {
  articleQuery.addEventListener("input", applyArticleFilters);
}

function setArticleType(nextType) {
  activeArticleType = nextType;
  articleTypeButtons.forEach((item) => {
    const isActive = item.dataset.articleType === nextType;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  applyArticleFilters();
}

applyArticleFilters();

const startupQuery = new URLSearchParams(window.location.search).get("q");
if (startupQuery && articleQuery) {
  articleQuery.value = startupQuery;
  applyArticleFilters();
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy]");
  if (!button) return;

  const text = button.dataset.copy || "";
  try {
    await navigator.clipboard.writeText(text);
    showToast(button.dataset.copyLabel || "Copied");
  } catch (error) {
    showToast(text || "Copy unavailable");
  }
});

function selectIssueCard(card) {
  if (!card) return;

  issueCards.forEach((item) => {
    const isSelected = item === card;
    item.classList.toggle("is-selected", isSelected);
    const button = item.querySelector(".issue-select-button");
    if (button) button.setAttribute("aria-pressed", String(isSelected));
  });

  if (selectedIssueCover) {
    selectedIssueCover.src = card.dataset.cover;
    selectedIssueCover.alt = `${card.dataset.year} ${card.dataset.title} cover`;
  }

  if (selectedIssueCoverLink) {
    selectedIssueCoverLink.href = card.dataset.url;
    selectedIssueCoverLink.setAttribute("aria-label", `Open ${card.dataset.year} ${card.dataset.title} issue page`);
  }

  if (selectedIssueTitle) selectedIssueTitle.textContent = card.dataset.title;
  if (selectedIssueMeta) {
    selectedIssueMeta.textContent = `${card.dataset.year} issue published on ${card.dataset.date}.`;
  }
  if (selectedIssueLink) selectedIssueLink.href = card.dataset.url;

  const template = document.getElementById(card.dataset.issueTemplate);
  if (template && signaturePaperList) {
    signaturePaperList.replaceChildren(template.content.cloneNode(true));
  }
}

function selectIssueFromButton(button) {
  const card = button ? button.closest("[data-issue-card]") : null;
  if (!card) return;
  selectIssueCard(card);
  showToast(card.dataset.title);
}

function filterIssueYear(button) {
  if (!button) return;

  const year = button.dataset.issueYear;
  issueYearButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  issueCards.forEach((card) => {
    card.classList.toggle("is-hidden", year !== "all" && card.dataset.year !== year);
  });

  const currentSelection = issueCards.find(
    (card) => card.classList.contains("is-selected") && !card.classList.contains("is-hidden")
  );
  if (!currentSelection) {
    selectIssueCard(issueCards.find((card) => !card.classList.contains("is-hidden")));
  }
}

window.selectIssueFromButton = selectIssueFromButton;
window.filterIssueYear = filterIssueYear;

if (issueArchiveList) {
  issueArchiveList.addEventListener("click", (event) => {
    const card = event.target.closest("[data-issue-card]");
    if (!card) return;
    selectIssueFromButton(card.querySelector(".issue-select-button"));
  });
}

if (issueYearFilter) {
  issueYearFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-issue-year]");
    if (!button) return;
    filterIssueYear(button);
  });
}

if (issueSelect) {
  issueSelect.addEventListener("change", () => {
    if (!issueSelect.value) return;
    const target = issueTargets[issueSelect.value];
    if (target) scrollToTarget(target);
    showToast(`${issueSelect.options[issueSelect.selectedIndex].text} selected`);
  });
}

function upgradeRelatedRoutes() {
  const routeSections = document.querySelectorAll(".aim-related-routes:not(.illustrated-related-routes)");
  if (!routeSections.length) return;

  const routes = [
    { href: "./aim-scope.html#aim-scope", image: "./assets/aim-scope-hero-network.png", label: "Journal fit", title: "Aim & Scope", description: "Review the research areas, topics, and article profiles welcomed by IJICS." },
    { href: "./instructions-for-authors.html#instructions-for-authors", image: "./assets/instructions-for-authors-hero.png", label: "Prepare", title: "Author guidelines", description: "Check originality, formatting, structure, files, and submission requirements." },
    { href: "./editorial-process.html#editorial-process", image: "./assets/editorial-process-hero.png", label: "Peer review", title: "Editorial process", description: "Understand the single-blind review process and editorial communication." },
    { href: "./submit-manuscript.html#submit-manuscript", image: "./assets/submit-manuscript-hero.png", label: "Submit", title: "Submit manuscript", description: "Open the official manuscript system and begin your IJICS submission." }
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  routeSections.forEach((section) => {
    const titleId = section.querySelector("h2")?.id || "related-routes-title";
    const cards = routes.map((route) => {
      const routePage = route.href.replace("./", "").split("#")[0];
      const currentAttribute = routePage === currentPage ? ' aria-current="page"' : "";
      return `<a href="${route.href}"${currentAttribute}><span class="related-route-visual" aria-hidden="true"><img src="${route.image}" alt="" /></span><span class="related-route-copy"><small>${route.label}</small><strong>${route.title}</strong><span>${route.description}</span></span><span class="related-route-arrow" aria-hidden="true">→</span></a>`;
    }).join("");

    section.classList.add("illustrated-related-routes");
    section.setAttribute("aria-labelledby", titleId);
    section.innerHTML = `<div class="related-routes-heading"><p class="eyebrow">Continue your journey</p><h2 id="${titleId}">Related routes</h2><p>Move from journal fit to manuscript preparation, peer review, and submission.</p></div><nav aria-label="Related journal information">${cards}</nav>`;

    if (!section.closest(".guided-information-page")) {
      const scopedWrapper = document.createElement("div");
      scopedWrapper.className = "guided-information-page related-routes-scope";
      section.before(scopedWrapper);
      scopedWrapper.append(section);
    }
  });
}

upgradeRelatedRoutes();
