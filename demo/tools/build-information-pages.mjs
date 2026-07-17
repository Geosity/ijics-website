import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const demoDir = dirname(dirname(fileURLToPath(import.meta.url)));

const iconPaths = {
  shield: `<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"></path><path d="m9 12 2 2 4-4"></path>`,
  access: `<rect x="3" y="11" width="18" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path>`,
  globe: `<circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 0 20"></path><path d="M12 2a15.3 15.3 0 0 0 0 20"></path><path d="M2 12h20"></path>`,
  document: `<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h8"></path>`,
};

function factIcon(label) {
  const key = label.toLowerCase();
  if (/(review|original|screen|ethic|approval)/.test(key)) return iconPaths.shield;
  if (/(access|license|copyright|fee|apc|charge)/.test(key)) return iconPaths.access;
  if (/(submission|file|proof|author|article|keyword)/.test(key)) return iconPaths.document;
  return iconPaths.globe;
}

const fact = (label, value) => `<article class="information-fact"><span class="information-fact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${factIcon(label)}</svg></span><div><strong>${label}</strong><span>${value}</span></div></article>`;

function informationPage({ id, label, title, lead, facts, toc, content, className = "" }) {
  return `      <div class="content-flow information-page guided-information-page ${className}">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><a href="./index.html#home">Home</a><span>/</span><strong>${label}</strong></nav>
        <section class="information-hero" id="${id}">
          <div class="information-hero-copy">
            <p class="eyebrow">${label}</p>
            <h1>${title}</h1>
            <p>${lead}</p>
          </div>
          <figure class="information-hero-visual" aria-hidden="true"><img src="./assets/aim-scope-hero-network.png" alt="" /></figure>
          <section class="information-fact-band" aria-label="${label} facts">
            ${facts.join("\n            ")}
          </section>
        </section>
        <section class="information-layout">
          <nav class="page-toc" aria-label="${label} sections">
            <strong>On this page</strong>
            ${toc.map(([href, text], index) => `<a href="#${href}"><span>${String(index + 1).padStart(2, "0")}</span>${text}</a>`).join("\n            ")}
          </nav>
          <div class="information-content">
${content.trim()}
          </div>
        </section>
        <section class="aim-related-routes" aria-labelledby="${id}-related-routes"><h2 id="${id}-related-routes">Related routes</h2><nav aria-label="Related journal information"><a href="./aim-scope.html#aim-scope"><strong>Aim &amp; Scope</strong><small>Check journal fit</small></a><a href="./instructions-for-authors.html#instructions-for-authors"><strong>Author guidelines</strong><small>Prepare the manuscript</small></a><a href="./editorial-process.html#editorial-process"><strong>Editorial process</strong><small>Understand peer review</small></a><a href="./submit-manuscript.html#submit-manuscript"><strong>Submit manuscript</strong><small>Open the official route</small></a></nav></section>
      </div>`;
}

const pages = new Map();

pages.set(
  "aim-scope.html",
  informationPage({
    id: "aim-scope",
    label: "Aim & Scope",
    title: "Intelligent control and intelligent systems",
    lead:
      "IJICS publishes fundamental contributions and innovative applications across the theory and practice of intelligent technologies.",
    facts: [
      fact("Journal model", "Peer reviewed"),
      fact("Access", "Open access"),
      fact("Core field", "Intelligent control"),
      fact("Coverage", "Theory and practice"),
    ],
    toc: [
      ["journal-objective", "Journal objective"],
      ["scope-topics", "Scope topics"],
      ["contribution-types", "Contributions"],
    ],
    content: `
            <article class="content-section" id="journal-objective">
              <h2>Journal objective</h2>
              <p>The International Journal of Intelligent Control and Systems (IJICS) is a peer-reviewed, open access international journal. It publishes articles describing recent fundamental contributions and innovative applications in the field of intelligent control and intelligent systems. Its objective is to disseminate important and leading-edge information in this new field in a timely fashion.</p>
            </article>
            <article class="content-section" id="scope-topics">
              <h2>Scope topics</h2>
              <p>IJICS covers theoretical and practical aspects of intelligent technologies and knowledge-based systems. The scope includes, but is not limited to:</p>
              <div class="scope-grid">
                <div class="scope-item"><strong>Robotics and automation</strong><span>Robotics, automation, and intelligent machines.</span></div>
                <div class="scope-item"><strong>Control methodologies</strong><span>Intelligent control methodologies.</span></div>
                <div class="scope-item"><strong>Systems</strong><span>System architecture, integration, coordination, modeling, and simulation.</span></div>
                <div class="scope-item"><strong>Development</strong><span>Hardware and software development for intelligent systems.</span></div>
              </div>
            </article>
            <article class="content-section" id="contribution-types">
              <h2>What IJICS publishes</h2>
              <div class="two-column-copy">
                <div><h3>Fundamental contributions</h3><p>Research that advances the understanding, methods, architecture, modeling, or control of intelligent systems.</p></div>
                <div><h3>Innovative applications</h3><p>Practical work that demonstrates new uses of intelligent control, automation, hardware, software, or integrated systems.</p></div>
              </div>
            </article>`,
  })
);

pages.set(
  "open-access.html",
  informationPage({
    id: "open-access",
    label: "Open Access Policy",
    title: "Diamond Open Access",
    lead:
      "Every IJICS article is freely available online, and publishing is free of charge for all authors.",
    facts: [
      fact("Access", "Immediate and permanent"),
      fact("Author fee", "No charge"),
      fact("License", "CC BY 4.0"),
      fact("Copyright", "Retained by authors"),
    ],
    toc: [
      ["access-model", "Access model"],
      ["reuse-rights", "Reuse rights"],
      ["author-copyright", "Copyright"],
      ["third-party-material", "Third-party material"],
    ],
    content: `
            <article class="content-section" id="access-model">
              <h2>Access model</h2>
              <p>IJICS is a Diamond Open Access journal. All published articles are immediately and permanently freely available online to all users, and publishing in this journal is entirely free of charge for all authors.</p>
              <div class="key-callout"><strong>No subscription. No author publishing fee.</strong><span>Readers can access published articles without payment, and authors are not charged to publish.</span></div>
            </article>
            <article class="content-section" id="reuse-rights">
              <h2>Reuse rights</h2>
              <p>IJICS serves authors and academic communities by publishing high-quality, peer-reviewed content under Creative Commons licenses, which promote the maximum dissemination and use of licensed materials. All articles published in IJICS are distributed under the latest version of the CC BY license.</p>
              <p>Under this license, users are free to read, download, copy, distribute, and adapt the material for any purpose, provided that appropriate credit is given to the original author(s) and the journal.</p>
              <a class="text-action" href="https://creativecommons.org/licenses/by/4.0/">Read the CC BY 4.0 legal terms</a>
            </article>
            <article class="content-section" id="author-copyright">
              <h2>Author copyright</h2>
              <p>Authors retain the full copyright of their work. The CC BY license governs how readers and other users may reuse the published article.</p>
            </article>
            <article class="content-section" id="third-party-material">
              <h2>Third-party material</h2>
              <p>The CC BY license does not apply to third-party materials, including figures, tables, or text, that are subject to separate copyright notices. Unless such content is also under CC BY or an equally permissive license, authors are responsible for obtaining any necessary permissions from the original copyright holder.</p>
            </article>`,
  })
);

pages.set(
  "author-center.html",
  informationPage({
    id: "author-center",
    label: "Author Center",
    title: "Prepare, submit, and track your manuscript",
    lead:
      "Start with the requirements, download a template, check the review process, and submit through the official IJICS system.",
    facts: [
      fact("Submission", "Online"),
      fact("Preferred file", "PDF"),
      fact("Peer review", "Double blind"),
      fact("APC", "No charge"),
    ],
    toc: [
      ["prepare", "Prepare"],
      ["templates", "Templates"],
      ["submit", "Submit"],
      ["review-process", "Review process"],
      ["after-acceptance", "After acceptance"],
    ],
    content: `
            <article class="content-section" id="prepare">
              <h2>Prepare your manuscript</h2>
              <p>Check scope fit, originality, author approval, article type, structure, language, references, figures, and tables before submission.</p>
              <a class="text-action" href="./instructions-for-authors.html#manuscript-preparation">View manuscript requirements</a>
            </article>
            <article class="content-section" id="templates">
              <h2>Use an IJICS template</h2>
              <div class="download-grid">
                <a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.docx"><strong>Word template</strong><span>DOCX, official IJICS file</span></a>
                <a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.zip"><strong>LaTeX template</strong><span>ZIP, official IJICS file</span></a>
              </div>
            </article>
            <article class="content-section" id="submit">
              <h2>Submit online</h2>
              <p>All prospective authors must submit manuscripts electronically. DOC and PDF files are accepted, and PDF is preferred.</p>
              <a class="primary-action" href="https://www.ijics.cn/user/login">View more</a>
            </article>
            <article class="content-section" id="review-process">
              <h2>Understand editorial review</h2>
              <p>Published articles are reviewed by a minimum of two independent reviewers through a double-blind peer review process. Articles are screened for plagiarism before acceptance.</p>
              <a class="text-action" href="./editorial-process.html#editorial-process">View editorial process</a>
            </article>
            <article class="content-section" id="after-acceptance">
              <h2>Proof correction</h2>
              <p>Corresponding authors receive a PDF proof for final review. Corrections should be returned within 5 days, and major manuscript changes are not permitted at this stage.</p>
            </article>`,
  })
);

pages.set(
  "article-processing-charge.html",
  informationPage({
    id: "article-processing-charge",
    label: "Article Processing Charge",
    title: "No author publishing charge",
    lead:
      "IJICS follows a Diamond Open Access model. Publishing in the journal is entirely free of charge for all authors.",
    facts: [
      fact("APC", "USD 0"),
      fact("Submission fee", "None"),
      fact("Publication fee", "None"),
      fact("Access", "Free to readers"),
    ],
    toc: [
      ["fee-policy", "Fee policy"],
      ["open-access-model", "Open access"],
      ["related-policies", "Related policies"],
    ],
    content: `
            <article class="content-section" id="fee-policy">
              <h2>Fee policy</h2>
              <p>Publishing in IJICS is entirely free of charge for all authors. The journal does not charge an article processing charge under its current Diamond Open Access policy.</p>
              <div class="fee-display"><span>Article Processing Charge</span><strong>0</strong><small>No payment is required from authors.</small></div>
            </article>
            <article class="content-section" id="open-access-model">
              <h2>Diamond Open Access</h2>
              <p>All published articles are immediately and permanently freely available online to all users. Access for readers and publication for authors are both free of charge.</p>
            </article>
            <article class="content-section" id="related-policies">
              <h2>Related policies</h2>
              <div class="inline-links"><a href="./open-access.html#open-access">Open Access Policy</a><a href="./licensing-terms.html#licensing-terms">Licensing Terms</a><a href="./copyright-terms.html#copyright-terms">Copyright Terms</a></div>
            </article>`,
  })
);

pages.set(
  "licensing-terms.html",
  informationPage({
    id: "licensing-terms",
    label: "Licensing Terms",
    title: "Creative Commons Attribution 4.0",
    lead:
      "IJICS articles are published under CC BY 4.0, supporting broad reuse with attribution.",
    facts: [
      fact("License", "CC BY 4.0"),
      fact("Commercial reuse", "Permitted"),
      fact("Adaptation", "Permitted"),
      fact("Attribution", "Required"),
    ],
    toc: [
      ["license-policy", "License policy"],
      ["permitted-use", "Permitted use"],
      ["attribution", "Attribution"],
      ["exceptions", "Exceptions"],
    ],
    content: `
            <article class="content-section" id="license-policy">
              <h2>License policy</h2>
              <p>All articles published in IJICS are distributed under the latest version of the Creative Commons Attribution license.</p>
              <a class="text-action" href="https://creativecommons.org/licenses/by/4.0/">View CC BY 4.0</a>
            </article>
            <article class="content-section" id="permitted-use">
              <h2>Permitted use</h2>
              <p>Users are free to read, download, copy, distribute, and adapt IJICS material for any purpose.</p>
              <div class="permission-grid"><span>Read</span><span>Download</span><span>Copy</span><span>Distribute</span><span>Adapt</span></div>
            </article>
            <article class="content-section" id="attribution">
              <h2>Attribution requirement</h2>
              <p>Appropriate credit must be given to the original author(s) and the journal when material is reused.</p>
            </article>
            <article class="content-section" id="exceptions">
              <h2>Third-party exceptions</h2>
              <p>Material covered by a separate copyright notice is not automatically included under CC BY. Authors must obtain permission when the relevant third-party material is not available under CC BY or an equally permissive license.</p>
            </article>`,
  })
);

pages.set(
  "copyright-terms.html",
  informationPage({
    id: "copyright-terms",
    label: "Copyright Terms",
    title: "Authors retain copyright",
    lead:
      "IJICS authors keep the full copyright of their work while allowing reuse through CC BY 4.0.",
    facts: [
      fact("Copyright owner", "Author(s)"),
      fact("Publication license", "CC BY 4.0"),
      fact("Reuse", "With attribution"),
      fact("Third-party rights", "Permission may be required"),
    ],
    toc: [
      ["author-rights", "Author rights"],
      ["reader-reuse", "Reader reuse"],
      ["third-party-rights", "Third-party rights"],
    ],
    content: `
            <article class="content-section" id="author-rights"><h2>Author rights</h2><p>Authors retain the full copyright of their work.</p></article>
            <article class="content-section" id="reader-reuse"><h2>Reader reuse</h2><p>Published articles are distributed under CC BY 4.0. Users may read, download, copy, distribute, and adapt the material for any purpose when appropriate credit is given to the original author(s) and IJICS.</p></article>
            <article class="content-section" id="third-party-rights"><h2>Third-party rights</h2><p>Figures, tables, text, and other material carrying a separate copyright notice may not be covered by the article license. Authors are responsible for obtaining the permissions needed to include and publish that material.</p></article>`,
  })
);

pages.set(
  "publication-ethics.html",
  informationPage({
    id: "publication-ethics",
    label: "Publication Ethics",
    title: "Ethical requirements for every submission",
    lead:
      "IJICS requires original work, responsible authorship, single-journal submission, and disclosure of generative AI use.",
    facts: [
      fact("Originality", "Required"),
      fact("Duplicate submission", "Prohibited"),
      fact("Author approval", "Required"),
      fact("AI use", "Must be declared"),
    ],
    toc: [
      ["plagiarism", "Plagiarism"],
      ["duplicate-submission", "Duplicate submission"],
      ["authorship", "Authorship"],
      ["ai-use", "AI use"],
    ],
    content: `
            <article class="content-section" id="plagiarism"><h2>Plagiarism</h2><p>Manuscripts must be original. All submissions are screened for plagiarism before peer review. High similarity scores may result in rejection without review.</p></article>
            <article class="content-section" id="duplicate-submission"><h2>Duplicate submission</h2><p>Manuscripts must not be submitted simultaneously to multiple journals or published elsewhere in English or any other language.</p></article>
            <article class="content-section" id="authorship"><h2>Authorship</h2><p>All listed authors must have made substantial contributions to the work and have approved the final version. The corresponding author is responsible for ensuring this.</p></article>
            <article class="content-section" id="ai-use"><h2>AI use statement</h2><p>If generative AI tools were used in manuscript preparation, including text generation, data analysis, or figure creation, this must be declared in the manuscript. AI tools cannot be listed as authors.</p></article>`,
  })
);

pages.set(
  "editorial-process.html",
  informationPage({
    id: "editorial-process",
    label: "Editorial Process",
    title: "Double-blind peer review",
    lead:
      "IJICS uses independent review, author and reviewer anonymity, plagiarism screening, and a defined proof-correction stage.",
    facts: [
      fact("Review model", "Double blind"),
      fact("Independent reviewers", "Minimum two"),
      fact("Plagiarism screening", "Before acceptance"),
      fact("Proof return", "Within 5 days"),
    ],
    toc: [
      ["submission-received", "Submission"],
      ["peer-review", "Peer review"],
      ["communication", "Communication"],
      ["proof-correction", "Proof correction"],
    ],
    content: `
            <article class="content-section" id="submission-received"><h2>Electronic submission</h2><p>Manuscripts are submitted through the IJICS online system. The submitting author receives an email acknowledging successful reception and assigning a reference number.</p></article>
            <article class="content-section" id="peer-review"><h2>Independent double-blind review</h2><p>Each published article is reviewed by a minimum of two independent reviewers. Reviewer identities are not known to the authors, and author identities are not known to the reviewers. Articles are screened for plagiarism before acceptance.</p></article>
            <article class="content-section" id="communication"><h2>Editorial communication</h2><p>Authors can inquire about review status by email. When modification is required, the author is informed by email.</p></article>
            <article class="content-section" id="proof-correction"><h2>Proof correction</h2><p>Corresponding authors receive a PDF proof for final review. Corrections should be submitted within 5 days. Major changes to the manuscript are not permitted at this stage.</p></article>`,
  })
);

pages.set(
  "submit-manuscript.html",
  informationPage({
    id: "submit-manuscript",
    label: "Submit Manuscript",
    title: "Submit through the official IJICS system",
    lead:
      "Prepare a DOC or PDF manuscript, verify the author list, and submit electronically through the IJICS login page.",
    facts: [
      fact("Submission route", "Online only"),
      fact("Accepted files", "DOC or PDF"),
      fact("Preferred file", "PDF"),
      fact("System domain", "www.ijics.cn"),
    ],
    toc: [
      ["before-submit", "Before submission"],
      ["submission-steps", "Submission steps"],
      ["reviewer-suggestions", "Reviewer suggestions"],
      ["official-login", "Official login"],
    ],
    content: `
            <article class="content-section" id="before-submit">
              <h2>Before submission</h2>
              <ul class="check-list"><li>The manuscript is original and not under consideration elsewhere.</li><li>The manuscript fits the IJICS Aims and Scope.</li><li>All authors have read and approved the submitted version.</li><li>The manuscript follows the preparation requirements.</li></ul>
            </article>
            <article class="content-section" id="submission-steps">
              <h2>Submission steps</h2>
              <ol class="numbered-flow"><li><strong>Register and sign in.</strong><span>Use the IJICS online submission system.</span></li><li><strong>Upload the manuscript.</strong><span>DOC and PDF files are accepted; PDF is preferred.</span></li><li><strong>Check the author list.</strong><span>Confirm that every co-author is included and the file is correctly uploaded.</span></li><li><strong>Receive the reference number.</strong><span>An email acknowledges successful reception of the submission.</span></li><li><strong>Follow editorial email.</strong><span>Status inquiries and modification requests are handled by email.</span></li></ol>
            </article>
            <article class="content-section" id="reviewer-suggestions"><h2>Reviewer suggestions</h2><p>Authors may suggest 2-3 potential reviewers by providing names, institutional email addresses, and reasons for suggestion. Suggested reviewers should not have co-authored or collaborated with the authors within the past three years.</p></article>
            <article class="content-section" id="official-login"><h2>Official login</h2><p>Check that the browser address begins with <strong>https://www.ijics.cn/</strong> before entering account credentials.</p><a class="primary-action" href="https://www.ijics.cn/user/login">View more</a></article>`,
  })
);

pages.set(
  "reviewers.html",
  informationPage({
    id: "reviewers",
    label: "For Reviewers",
    title: "Review rules and requirements",
    lead:
      "Reviewers can verify the invitation, read the IJICS review model, and enter the official review system from one page.",
    facts: [
      fact("Review model", "Double blind"),
      fact("Reviewers per article", "Minimum two"),
      fact("Screening", "Plagiarism check"),
      fact("Portal", "Official IJICS login"),
    ],
    toc: [
      ["review-rules", "Review rules"],
      ["review-requirements", "Requirements"],
      ["invitation", "Invitation check"],
      ["review-login", "Reviewer login"],
    ],
    content: `
            <article class="content-section" id="review-rules"><h2>Review rules</h2><p>IJICS uses a double-blind peer review process. Reviewer identities are not known to the authors, and author identities are not known to the reviewers. Each published article is reviewed by a minimum of two independent reviewers.</p></article>
            <article class="content-section" id="review-requirements"><h2>Review requirements</h2><ul class="check-list"><li>Assess whether the manuscript fits the journal scope.</li><li>Consider academic novelty, thoughtfulness, and practicability.</li><li>Check whether the main contribution is clear and supported.</li><li>Protect the double-blind review process.</li><li>Raise potential plagiarism or duplicate-publication concerns.</li></ul></article>
            <article class="content-section" id="invitation"><h2>Verify the invitation</h2><p>Confirm that the invitation identifies IJICS and provides a manuscript title or reference. Use the official domain and Editorial Office contact when a message or link is unclear.</p><div class="identity-check"><span>Official domain</span><strong>www.ijics.cn</strong><span>Editorial Office</span><strong>ijics@caa.org.cn</strong></div></article>
            <article class="content-section" id="review-login"><h2>Reviewer login</h2><p>The IJICS online system is used for journal workflow access.</p><a class="primary-action" href="https://www.ijics.cn/user/login">View more</a></article>`,
  })
);

pages.set(
  "anti-fraud.html",
  informationPage({
    id: "anti-fraud",
    label: "Anti-Fraud Notice",
    title: "Verify every journal message",
    lead:
      "Check the official domain, Editorial Office email, login address, and fee policy before sharing files or credentials.",
    facts: [
      fact("Official domain", "www.ijics.cn"),
      fact("Official email", "ijics@caa.org.cn"),
      fact("Official login", "/user/login"),
      fact("Author fee", "No charge"),
    ],
    toc: [
      ["official-identity", "Official identity"],
      ["login-check", "Login check"],
      ["payment-check", "Payment check"],
      ["report-message", "Report a message"],
    ],
    content: `
            <article class="content-section" id="official-identity"><h2>Official identity</h2><p>The journal website is <strong>www.ijics.cn</strong>. The public Editorial Office email is <strong>ijics@caa.org.cn</strong>.</p></article>
            <article class="content-section" id="login-check"><h2>Check the login address</h2><p>The journal workflow login is located at <strong>https://www.ijics.cn/user/login</strong>. Check the browser address before entering credentials.</p></article>
            <article class="content-section" id="payment-check"><h2>Check payment claims</h2><p>IJICS is a Diamond Open Access journal, and publishing is free of charge for all authors. Do not act on a payment request that conflicts with the public Article Processing Charge page.</p></article>
            <article class="content-section" id="report-message"><h2>Report a suspicious message</h2><p>Forward the sender address, link, and manuscript reference to the Editorial Office. Do not include account passwords or payment credentials.</p><a class="primary-action" href="mailto:ijics@caa.org.cn">Email Editorial Office</a></article>`,
  })
);

pages.set(
  "publisher-information.html",
  informationPage({
    id: "publisher-information",
    label: "Publisher Information",
    title: "Journal identity and administration",
    lead:
      "Official journal identity, society affiliation, ISSN, domain, and contact details are presented together for reference.",
    facts: [
      fact("Journal", "IJICS"),
      fact("ISSN", "0218-7965"),
      fact("Society", "Chinese Association of Automation"),
      fact("Official domain", "www.ijics.cn"),
    ],
    toc: [
      ["journal-identity", "Journal identity"],
      ["society-listing", "Society listing"],
      ["publishing-model", "Publishing model"],
      ["editorial-governance", "Editorial governance"],
      ["editorial-office", "Editorial Office"],
    ],
    content: `
            <article class="content-section" id="journal-identity"><h2>Journal identity</h2><dl class="metadata-list"><div><dt>Full title</dt><dd>The International Journal of Intelligent Control and Systems</dd></div><div><dt>Abbreviation</dt><dd>IJICS</dd></div><div><dt>ISSN</dt><dd>0218-7965</dd></div><div><dt>Official website</dt><dd><a href="https://www.ijics.cn/">https://www.ijics.cn/</a></dd></div></dl></article>
            <article class="content-section" id="society-listing"><h2>Society listing</h2><p>IJICS is listed among the journals of the Chinese Association of Automation (CAA).</p><a class="text-action" href="https://www.caa.org.cn/Content/320.html">View the CAA journal listing</a></article>
            <article class="content-section" id="publishing-model"><h2>Publishing model</h2><p>IJICS operates as a Diamond Open Access journal. Articles are immediately and permanently available online, authors are not charged a publication fee, and articles are distributed under CC BY 4.0 while authors retain copyright.</p><div class="inline-links"><a href="./open-access.html#open-access">Open Access Policy</a><a href="./article-processing-charge.html#article-processing-charge">Author Charges</a><a href="./licensing-terms.html#licensing-terms">Licensing Terms</a></div></article>
            <article class="content-section" id="editorial-governance"><h2>Editorial governance</h2><p>The public Editorial Board page identifies the Editor-in-Chief, Deputy Editors, Associate Editors, and their institutional affiliations. Editorial Office contact information is provided below.</p><a class="text-action" href="./editorial-board.html#editorial-board">View the Editorial Board</a></article>
            <article class="content-section" id="editorial-office"><h2>Editorial Office</h2><dl class="metadata-list"><div><dt>Email</dt><dd><a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a></dd></div><div><dt>Telephone</dt><dd>010-61943066</dd></div><div><dt>Address</dt><dd>Room 1505, Satellite Building, No. 63 Zhichun Road, Haidian District, Beijing 100190, China</dd></div></dl></article>`,
  })
);

const associateEditors = [
  ["P. J. Antsaklis", "Notre Dame University, USA"],
  ["P. Bonissone", "GE Center for Research and Development, USA"],
  ["Y. B. Chen", "Purdue University at Indianapolis, USA"],
  ["C. W. de Silva", "University of British Columbia, Canada"],
  ["C. C. Hang", "National University of Singapore, Singapore"],
  ["H. Hashimoto", "University of Tokyo, Japan"],
  ["C. J. Harris", "University of Southampton, UK"],
  ["Y. C. Ho", "Harvard University, USA"],
  ["B. Hrúz", "Slovak University of Technology in Bratislava, Slovak Republic"],
  ["A. Kusiak", "University of Iowa, USA"],
  ["K. J. Kyriakopoulos", "National Technical University of Athens, Greece"],
  ["G. S. C. Lee", "National Science Foundation, USA"],
  ["S. Lee", "Sungkyunkwan University, Korea"],
  ["F. L. Lewis", "The University of Texas at Arlington, USA"],
  ["P. M. U. A. Lima", "Instituto Superior Técnico, Portugal"],
  ["D. Liu", "University of Illinois at Chicago, USA"],
  ["Y. X. Lu", "Chinese Academy of Sciences, China"],
  ["J. E. Mcinroy", "University of Wyoming, USA"],
  ["A. Nerode", "Cornell University, USA"],
  ["U. Ozguner", "Ohio State University, USA"],
  ["F. Pfeiffer", "Technische Universität München, Germany"],
  ["P. S. Schenker", "Jet Propulsion Laboratory, USA"],
  ["R. Z. Song", "University of Science and Technology Beijing, China"],
  ["Y. G. Tang", "Rowan University, USA"],
  ["T. J. Tarn", "Washington University, USA"],
  ["J. Wang", "Monmouth University, USA"],
  ["Z. S. Wang", "Northeastern University, China"],
  ["Z. Wang", "Beihang University, China"],
  ["W. M. Wonham", "University of Toronto, Canada"],
  ["Q. M. Yang", "Zhejiang University, China"],
  ["D. Zeng", "Chinese Academy of Sciences, China"],
  ["P. J. Zhang", "Tsinghua University, China"],
  ["Y. F. Zheng", "Ohio State University, USA"],
  ["M. C. Zhou", "New Jersey Institute of Technology, USA"],
  ["H. Zhu", "Nipissing University, Canada"],
  ["R. Zurawski", "Atut Technology, USA"],
  ["J. Zhang", "Wuhan University, China"],
];

pages.set(
  "editorial-board.html",
  informationPage({
    id: "editorial-board",
    label: "Editorial Board",
    title: "Editorial leadership and affiliations",
    lead:
      "The IJICS Editorial Board is presented with each member's institutional affiliation and country.",
    facts: [
      fact("Editor-in-Chief", "Fei-Yue Wang"),
      fact("Deputy Editors-in-Chief", "2"),
      fact("Associate Editors", String(associateEditors.length)),
      fact("Editorial contact", "ijics@caa.org.cn"),
    ],
    toc: [
      ["editor-in-chief", "Editor-in-Chief"],
      ["deputy-editors", "Deputy Editors"],
      ["associate-editors", "Associate Editors"],
      ["editorial-office", "Editorial Office"],
    ],
    content: `
            <article class="content-section" id="editor-in-chief"><h2>Editor-in-Chief</h2><div class="leader-card"><div><strong>Fei-Yue Wang</strong><span>Chinese Academy of Sciences, China</span></div></div></article>
            <article class="content-section" id="deputy-editors"><h2>Deputy Editors-in-Chief</h2><div class="leader-grid"><div class="leader-card"><div><strong>C. L. Philip Chen</strong><span>South China University of Technology, China</span></div></div><div class="leader-card"><div><strong>Qinglai Wei</strong><span>Chinese Academy of Sciences, China</span></div></div></div></article>
            <article class="content-section" id="associate-editors"><h2>Associate Editors</h2><details class="board-disclosure"><summary>View all ${associateEditors.length} Associate Editors</summary><ul class="editor-directory">${associateEditors.map(([name, affiliation]) => `<li><strong>${name}</strong><span>${affiliation}</span></li>`).join("")}</ul></details></article>
            <article class="content-section" id="editorial-office"><h2>Editorial Office</h2><dl class="metadata-list"><div><dt>Email</dt><dd><a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a></dd></div><div><dt>Telephone</dt><dd>010-61943066</dd></div><div><dt>Address</dt><dd>Room 1505, Satellite Building, No. 63 Zhichun Road, Haidian District, Beijing 100190, China</dd></div></dl></article>`,
  })
);

pages.set(
  "instructions-for-authors.html",
  informationPage({
    id: "instructions-for-authors",
    label: "Instructions for Authors",
    title: "Prepare a complete IJICS submission",
    lead:
      "Use this guide to check originality, article type, structure, files, submission, peer review, proof correction, and ethics.",
    facts: [
      fact("Language", "English"),
      fact("Preferred file", "PDF"),
      fact("Keywords", "4-6"),
      fact("Review", "Double blind"),
    ],
    toc: [
      ["submission-checklist", "Checklist"],
      ["manuscript-preparation", "Preparation"],
      ["article-types", "Article types"],
      ["templates", "Templates"],
      ["manuscript-structure", "Structure"],
      ["submission-process", "Submission"],
    ],
    className: "long-guide",
    content: `
            <article class="content-section" id="submission-checklist"><h2>Submission checklist</h2><div class="check-grid"><div>The manuscript has not been published previously and is not under consideration elsewhere.</div><div>The manuscript falls within the IJICS Aims and Scope.</div><div>All authors have read and approved the submitted version.</div><div>The manuscript follows the preparation requirements below.</div></div><section class="integrity-screening" aria-labelledby="integrity-screening-title"><div class="integrity-screening-intro"><h3 id="integrity-screening-title">Academic integrity screening</h3><p>To maintain academic integrity, all submissions are subject to screening for similarity, author self-citation, and reference source diversity. Authors should adhere to the following guidelines. Manuscripts that seriously deviate from these guidelines may be rejected.</p></div><ol class="integrity-thresholds"><li><div class="integrity-numbers"><strong>&lt;30%</strong><span>overall similarity</span><strong>&lt;15%</strong><span>from any single source</span></div><p>The overall similarity should be less than 30%, and the similarity matched to any single source should be less than 15%.</p></li><li><div class="integrity-numbers"><strong>&lt;20%</strong><span>author self-citations</span></div><p>Self-citations from all authors should account for less than 20% of the total number of references.</p></li><li><div class="integrity-numbers"><strong>&lt;20%</strong><span>from one source</span></div><p>References from a single source, i.e., a specific person, journal, conference, etc., should account for less than 20% of the total number of references.</p></li></ol></section></article>
            <details class="content-disclosure" open id="manuscript-preparation"><summary>Manuscript preparation</summary><div class="disclosure-body"><h3>Language</h3><p>Manuscripts must be written in good English. Grammatical and spelling errors should be carefully avoided. Manuscripts of low quality or poor English writing will be rejected without review.</p><h3>Novelty</h3><p>Manuscripts should reflect the latest developments of the research area, with emphasis on academic novelty, thoughtfulness, and practicability. Contributions should highlight the main points. Dull narration and ordinary derivation should be reduced or deleted. The same statements should not be repeated in the Abstract, Introduction, and Conclusions.</p><h3 id="article-types">Article types</h3><div class="article-type-grid"><div><strong>Research Article</strong><p>Original, innovative, and significant work with quantitative and detailed research data, literature support, and specific technical accomplishments.</p></div><div><strong>Communications and Letters</strong><p>A personal opinion or new perspective on existing research that highlights recent work and provides new insight.</p></div><div><strong>New AI and New Society</strong><p>A concise article addressing an interesting problem, reporting a striking finding, or proposing a new method or model. Recommended length: no more than 3 journal pages.</p></div></div><h3 id="templates">Templates and file format</h3><p>Writing should be simple and straightforward, data should be reliable, and undue self-appraisal should be avoided. PDF is preferred for submission, and DOC is also accepted.</p><div class="download-grid"><a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.docx"><strong>Word template</strong><span>DOCX, official IJICS file</span></a><a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.zip"><strong>LaTeX template</strong><span>ZIP, official IJICS file</span></a></div></div></details>
            <details class="content-disclosure" id="manuscript-structure"><summary>Manuscript structure</summary><div class="disclosure-body"><ol class="structured-list"><li><strong>Title page</strong><span>Concise title, all author names, affiliations, email addresses, and the corresponding author.</span></li><li><strong>Abstract</strong><span>Purpose, methods, main results, and conclusions. Avoid references, figures, and tables.</span></li><li><strong>Keywords</strong><span>Provide 4-6 keywords.</span></li><li><strong>Introduction</strong><span>Background, research questions, and significance.</span></li><li><strong>Materials and Methods</strong><span>Methods described in enough detail to support reproducibility.</span></li><li><strong>Results and Discussion</strong><span>Presentation and interpretation of findings.</span></li><li><strong>Conclusions</strong><span>Key findings and implications.</span></li><li><strong>Acknowledgments</strong><span>Funding sources, fund name, and fund number.</span></li><li><strong>References</strong><span>All cited references in ascending numerical order.</span></li><li><strong>Author biography</strong><span>Color photograph, education, current position, and research interests.</span></li></ol></div></details>
            <details class="content-disclosure"><summary>Equations, figures, tables, and references</summary><div class="disclosure-body"><h3>Equations</h3><p>Label equations in order. Refer to them as Eq. (1) or Eqs. (1) and (2). Variables are usually italicized and must be defined at first use.</p><h3>Figures</h3><p>Label and cite figures in order as Fig. 1 or Figs. 1 and 2. Each figure needs a concise caption and should appear after its first citation. Vector graphics or high-resolution files of at least 300 dpi are recommended.</p><h3>Tables</h3><p>Label and cite tables in order as Table 1 or Tables 1 and 2. Each table needs a concise caption and should appear after its first citation.</p><h3>Reference examples</h3><div class="reference-examples"><p><strong>Journal:</strong> D. Payton, R. Estkowski, and M. Howard, Compound behaviors in pheromone robotics, Robot. Auton. Syst., 2003, 44(3), 229-240.</p><p><strong>Book:</strong> B. Ran and D. E. Boyce, Modeling Dynamic Transportation Network. Berlin, Germany: Springer-Verlag, 1996, 69-83.</p><p><strong>Website:</strong> J. M. Tour, Image processing toolbox for use with MATLAB: User's guide [Online], http://www.mathworks.com, 3 November 2006.</p></div></div></details>
            <details class="content-disclosure" id="submission-process"><summary>Submission and reviewer suggestions</summary><div class="disclosure-body"><ol class="numbered-flow"><li><strong>Submit online.</strong><span>Register and sign in at https://www.ijics.cn/user/login.</span></li><li><strong>Upload electronically.</strong><span>DOC and PDF files are accepted; PDF is preferred.</span></li><li><strong>Check authorship.</strong><span>Confirm that the manuscript is uploaded correctly and all co-authors are included.</span></li><li><strong>Keep the reference number.</strong><span>An email acknowledges successful reception.</span></li><li><strong>Follow status by email.</strong><span>Modification requests are communicated by email.</span></li></ol><h3>Reviewer suggestions</h3><p>Authors may suggest 2-3 potential reviewers with names, institutional email addresses, and reasons for suggestion. Suggested reviewers should not have co-authored or collaborated with the authors within the past three years.</p><a class="primary-action" href="https://www.ijics.cn/user/login">View more</a></div></details>
            <details class="content-disclosure"><summary>Peer review, proof correction, and ethics</summary><div class="disclosure-body"><h3>Peer review</h3><p>Each published article is reviewed by a minimum of two independent reviewers using a double-blind process. Articles are screened for plagiarism before acceptance.</p><h3>Proof correction</h3><p>Corresponding authors receive a PDF proof for final review. Corrections should be submitted within 5 days. Major manuscript changes are not permitted at this stage.</p><div class="inline-links"><a href="./editorial-process.html#editorial-process">Editorial Process</a><a href="./publication-ethics.html#publication-ethics">Publication Ethics</a></div></div></details>`,
  })
);

for (const [file, content] of pages) {
  if (file === "aim-scope.html" || file === "author-center.html") continue;
  const path = join(demoDir, file);
  const html = await readFile(path, "utf8");
  const start = html.indexOf('      <div class="content-flow');
  const end = html.indexOf("\n    </main>", start);
  if (start === -1 || end === -1) {
    throw new Error(`Could not locate content-flow in ${file}`);
  }
  const next = `${html.slice(0, start)}${content}${html.slice(end)}`;
  await writeFile(path, next);
}

console.log(`Rebuilt ${pages.size} information pages.`);
