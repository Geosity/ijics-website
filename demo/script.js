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
const currentPageName = window.location.pathname.split("/").pop() || "index.html";
let activeArticleType = "all";
let toastTimer;

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
