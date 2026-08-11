#!/usr/bin/env python3

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys


DEMO_DIR = Path(__file__).resolve().parent.parent
LEGACY_ALIASES = {"copyright-license.html"}
FORBIDDEN_PUBLIC_TEXT = (
    "website preview",
    "page preview",
    "database evaluation",
    "source capture",
    "implemented page",
    "interface placeholder",
    "example accepted article",
    "production article",
    "internal record",
    "to be confirmed",
    "sample article",
    "metadata rule",
)


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.hrefs = []
        self.h1_count = 0
        self.title_count = 0
        self.description = None
        self.canonical = None
        self.robots = ""
        self.quick_depth = 0
        self.footer_depth = 0
        self.quick_text = []
        self.quick_links = []
        self.quick_close_count = 0
        self.footer_text = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.add(attributes["id"])
        if tag == "a" and attributes.get("href"):
            self.hrefs.append(attributes["href"])
            if self.quick_depth:
                self.quick_links.append(attributes["href"])
        if tag == "h1":
            self.h1_count += 1
        if tag == "title":
            self.title_count += 1
        if tag == "meta" and attributes.get("name", "").lower() == "description":
            self.description = attributes.get("content", "").strip()
        if tag == "meta" and attributes.get("name", "").lower() == "robots":
            self.robots = attributes.get("content", "").lower()
        if tag == "link" and "canonical" in attributes.get("rel", "").lower().split():
            self.canonical = attributes.get("href", "").strip()

        classes = set(attributes.get("class", "").split())
        if tag == "button" and self.quick_depth and "quick-access-close" in classes:
            self.quick_close_count += 1
            if attributes.get("aria-label") != "Close Quick Access":
                self.quick_close_count += 100
        if tag == "aside" and "quick-access-float" in classes:
            self.quick_depth = 1
        elif self.quick_depth:
            self.quick_depth += 1

        if tag == "footer" and "site-footer" in classes:
            self.footer_depth = 1
        elif self.footer_depth:
            self.footer_depth += 1

    def handle_endtag(self, tag):
        if self.quick_depth:
            self.quick_depth -= 1
        if self.footer_depth:
            self.footer_depth -= 1

    def handle_data(self, data):
        text = " ".join(data.split())
        if not text:
            return
        if self.quick_depth:
            self.quick_text.append(text)
        if self.footer_depth:
            self.footer_text.append(text)


def check_local_link(source, href, pages, errors):
    if href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
        return
    parts = urlsplit(href)
    target_name = unquote(parts.path)
    target = source if not target_name else (source.parent / target_name).resolve()
    if target.is_dir():
        target = target / "index.html"
    if target not in pages:
        errors.append(f"{source.name}: missing local target {href}")
        return
    if parts.fragment and parts.fragment not in pages[target].ids:
        errors.append(f"{source.name}: missing anchor {href}")


def main():
    html_files = sorted(DEMO_DIR.glob("*.html"))
    pages = {}
    errors = []

    for path in html_files:
        parser = PageParser()
        source = path.read_text(encoding="utf-8")
        parser.feed(source)
        pages[path.resolve()] = parser

        lowered = source.lower()
        for phrase in FORBIDDEN_PUBLIC_TEXT:
            if phrase in lowered:
                errors.append(f"{path.name}: forbidden public phrase '{phrase}'")

        if parser.title_count != 1:
            errors.append(f"{path.name}: expected one title, found {parser.title_count}")
        if not parser.canonical:
            errors.append(f"{path.name}: missing canonical")

        if path.name in LEGACY_ALIASES:
            if "noindex" not in parser.robots:
                errors.append(f"{path.name}: legacy alias must be noindex")
            continue

        if not parser.description:
            errors.append(f"{path.name}: missing meta description")
        if parser.h1_count != 1:
            errors.append(f"{path.name}: expected one h1, found {parser.h1_count}")

        if path.name == "index.html":
            homepage_requirements = (
                "The Journal at a Glance",
                "Latest Issue",
                "latestIssueCover",
                "latestIssueLabel",
                "latestIssueCount",
                "latestIssueLink",
                "Intelligent Control Theory",
                "Multi-Agent Systems",
                "Machine Learning",
                "Intelligent Robotics",
                "Unmanned Systems",
                "Intelligent Manufacturing",
                "Networked Control Systems",
                "System Integration &amp; Automation",
            )
            for requirement in homepage_requirements:
                if requirement not in source:
                    errors.append(f"{path.name}: missing homepage item '{requirement}'")
            if source.count('class="journal-value-item"') != 4:
                errors.append(f"{path.name}: recognition band must contain four supported items")
            if source.count('class="article-metrics"') != 8:
                errors.append(f"{path.name}: each of the eight current-issue articles needs usage metrics")
            if source.count('data-metric="read"') != 8 or source.count('data-metric="download"') != 8:
                errors.append(f"{path.name}: usage metrics must include read and download counts")
            if source.count('class="cite-action"') != 8:
                errors.append(f"{path.name}: each current-issue article needs a Cite action")
            if source.count("/api/ijics/article/download/") != 8:
                errors.append(f"{path.name}: each current-issue PDF action must use the official download counter")
            if 'data-citation-format="ieee"' not in source or 'data-citation-format="apa"' not in source or 'data-citation-format="bibtex"' not in source:
                errors.append(f"{path.name}: citation chooser must offer IEEE, APA, and BibTeX")
            section_order = (source.find('id="current-issue"'), source.find('id="call-for-papers"'))
            if -1 in section_order or section_order != tuple(sorted(section_order)):
                errors.append(f"{path.name}: Latest Issue must precede Calls for Papers")

        if path.name == "instructions-for-authors.html":
            for requirement in ("&lt;30%", "&lt;15%", "&lt;20%", "Originality and Similarity Screening"):
                if requirement not in source:
                    errors.append(f"{path.name}: missing integrity threshold '{requirement}'")
            if source.count('class="integrity-thresholds"') != 1:
                errors.append(f"{path.name}: expected one academic integrity threshold group")

        if 'id="site-structure"' in source or 'class="quick-access-float' in source:
            errors.append(f"{path.name}: obsolete Quick Access panel must not be rendered")

        footer_text = " ".join(parser.footer_text)
        for group in ("About", "Articles", "For Authors", "Policies"):
            if group not in footer_text:
                errors.append(f"{path.name}: footer missing {group}")

        if path.name != "index.html" and any(
            marker in source
            for marker in ('class="information-fact-band"', 'class="aim-fact-band"', 'class="author-hero-advantages"')
        ):
            errors.append(f"{path.name}: redundant summary fact band must not be rendered")

    for path, parser in pages.items():
        for href in parser.hrefs:
            check_local_link(path, href, pages, errors)

    css = (DEMO_DIR / "styles.css").read_text(encoding="utf-8")
    if css.count("{") != css.count("}"):
        errors.append("styles.css: unbalanced braces")
    if re.search(r",\s*@media", css):
        errors.append("styles.css: dangling selector before @media")
    if "counter(guided-section" in css:
        errors.append("styles.css: decorative information-page section counters must not be rendered")
    if not re.search(
        r"\.section-shortcuts a,\s*\.nav-menu summary\s*\{[^}]*text-transform:\s*none",
        css,
        re.S,
    ):
        errors.append("styles.css: primary navigation casing must remain consistent across pages")

    if errors:
        print("Static audit failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Static audit passed for {len(html_files)} HTML pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
