import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const demoDir = dirname(dirname(fileURLToPath(import.meta.url)));

const legacyAliases = new Map([
  [
    "copyright-license.html",
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,follow" />
    <meta http-equiv="refresh" content="0; url=./licensing-terms.html#licensing-terms" />
    <link rel="canonical" href="https://www.ijics.cn/licensing-terms/" />
    <title>Licensing | IJICS</title>
  </head>
  <body>
    <p>This page has moved to <a href="./licensing-terms.html#licensing-terms">Licensing</a>.</p>
  </body>
</html>
`,
  ],
]);

const header = `    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="./index.html#home" aria-label="IJICS home">
          <img class="brand-logo" src="./assets/ijics-circle-mark.png" width="640" height="508" alt="IJICS" />
          <span class="brand-name">The International Journal of<br />Intelligent Control and Systems</span>
        </a>
        <nav class="section-shortcuts" aria-label="Primary navigation">
          <a href="./index.html#home">Home</a>
          <details class="nav-menu">
            <summary>About the Journal</summary>
            <div class="nav-menu-panel">
              <a href="./aim-scope.html#aim-scope">Aims and Scope</a>
              <a href="./editorial-board.html#editorial-board">Editorial Board</a>
              <a href="./publisher-information.html#publisher-information">Journal Information</a>
              <a href="./publication-ethics.html#publication-ethics">Publishing Ethics</a>
              <a href="./open-access.html#open-access">Open Access</a>
            </div>
          </details>
          <details class="nav-menu">
            <summary>Articles</summary>
            <div class="nav-menu-panel">
              <a href="./index.html#current-issue">Latest Issue</a>
              <a href="./forthcoming-issue.html#forthcoming-issue">Early Access</a>
              <a href="./all-issues.html#all-issues">All Issues</a>
              <a href="./index.html#call-for-papers">Calls for Papers</a>
            </div>
          </details>
          <details class="nav-menu">
            <summary>Author Center</summary>
            <div class="nav-menu-panel">
              <a href="./author-center.html#author-center">Author Center</a>
              <a href="./instructions-for-authors.html#instructions-for-authors">Submission Guidelines</a>
              <a href="./editorial-process.html#editorial-process">Peer Review Process</a>
              <a href="./article-processing-charge.html#article-processing-charge">Article Processing Charges</a>
            </div>
          </details>
          <a href="./search-articles.html#search-articles">Search Articles</a>
          <a class="nav-submit" href="./submit-manuscript.html#submit-manuscript">Submit a Manuscript</a>
        </nav>
      </div>
      <div class="navigation-board" id="headerSearchPanel">
        <form class="nav-article-search" id="article-search" role="search">
          <label for="articleQuery">Search articles</label>
          <div class="nav-search-row">
            <input id="articleQuery" type="search" placeholder="Title, author, DOI, keyword" autocomplete="off" />
            <select id="issueSelect" aria-label="Article collection">
              <option value="">All articles</option>
              <optgroup label="Articles">
                <option value="current">Latest Issue</option>
                <option value="forthcoming">Early Access</option>
                <option value="archive">All Issues</option>
              </optgroup>
              <optgroup label="Journal information">
                <option value="cfp">Calls for Papers</option>
                <option value="authors">Author Center</option>
              </optgroup>
            </select>
            <button type="submit" aria-label="Search articles">Search</button>
          </div>
        </form>
      </div>
    </header>`;

const footer = `    <footer class="site-footer" id="contact" aria-label="Journal information and navigation">
      <div class="footer-compliance">
        <nav class="footer-directory" aria-label="Complete journal navigation">
          <section class="footer-directory-group">
            <h2>About the Journal</h2>
            <a href="./aim-scope.html#aim-scope">Aims and Scope</a>
            <a href="./editorial-board.html#editorial-board">Editorial Board</a>
            <a href="./editorial-board.html#editorial-office">Editorial Office</a>
            <a href="./publisher-information.html#publisher-information">Journal Information</a>
          </section>
          <section class="footer-directory-group">
            <h2>Articles</h2>
            <a href="./index.html#current-issue">Latest Issue</a>
            <a href="./forthcoming-issue.html#forthcoming-issue">Early Access</a>
            <a href="./all-issues.html#all-issues">All Issues</a>
            <a href="./search-articles.html#search-articles">Search Articles</a>
            <a href="./index.html#call-for-papers">Calls for Papers</a>
          </section>
          <section class="footer-directory-group">
            <h2>Author Center</h2>
            <a href="./author-center.html#author-center">Author Center</a>
            <a href="./instructions-for-authors.html#instructions-for-authors">Submission Guidelines</a>
            <a href="./submit-manuscript.html#submit-manuscript">Submit a Manuscript</a>
            <a href="./editorial-process.html#editorial-process">Peer Review Process</a>
            <a href="./article-processing-charge.html#article-processing-charge">Article Processing Charges</a>
            <a href="./reviewers.html#reviewers">Reviewer Guidelines</a>
          </section>
          <section class="footer-directory-group">
            <h2>Policies</h2>
            <a href="./publication-ethics.html#publication-ethics">Publishing Ethics</a>
            <a href="./open-access.html#open-access">Open Access</a>
            <a href="./licensing-terms.html#licensing-terms">Licensing</a>
            <a href="./copyright-terms.html#copyright-terms">Copyright</a>
            <a href="./anti-fraud.html#anti-fraud">Anti-Fraud Notice</a>
          </section>
        </nav>
        <div class="identity-strip">
          <span>The International Journal of Intelligent Control and Systems</span>
          <span>IJICS</span>
          <span>ISSN: 0218-7965</span>
          <span>Peer review: Single blind</span>
          <span>Current manuscript processing fee: None</span>
          <a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a>
          <span>Tel: 010-61943066</span>
          <span>Room 1505, Satellite Building, No. 63 Zhichun Road, Haidian District, Beijing 100190, China</span>
          <span>京ICP备18005680号-5</span>
          <span>© 2021 IJICS. All rights reserved.</span>
        </div>
      </div>
    </footer>`;

const files = (await readdir(demoDir)).filter((file) => file.endsWith(".html"));

for (const file of files) {
  const path = join(demoDir, file);
  if (legacyAliases.has(file)) {
    await writeFile(path, legacyAliases.get(file));
    continue;
  }
  let html = await readFile(path, "utf8");
  html = html.replace(/    <header class="site-header">[\s\S]*?<\/header>/, header);
  html = html.replace(/      <aside class="quick-access-float[^"]*"[\s\S]*?<\/aside>/, "");
  html = html.replace(/    <footer class="site-footer"[\s\S]*?<\/footer>/, footer);
  html = html.replace(/<title>(.*?) \| IJICS Website Preview<\/title>/, "<title>$1 | IJICS</title>");
  html = html.replace("<title>IJICS Website Preview</title>", "<title>IJICS | The International Journal of Intelligent Control and Systems</title>");
  html = html.replace(/styles\.css\?v=\d+/g, "styles.css?v=152");
  html = html.replace(/script\.js\?v=\d+/g, "script.js?v=152");
  await writeFile(path, html);
}

console.log(`Updated shared shell in ${files.length} HTML files.`);
