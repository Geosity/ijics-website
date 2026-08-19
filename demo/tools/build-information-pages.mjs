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

function informationPage({ id, label, title, lead, toc, content, className = "" }) {
  const heroImage = id === "aim-scope" || id === "author-center"
    ? "aim-scope-hero-network.png"
    : `${id}-hero.png`;

  return `      <div class="content-flow information-page guided-information-page ${className}">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><a href="./index.html#home">Home</a><span>/</span><strong>${label}</strong></nav>
        <section class="information-hero" id="${id}">
          <div class="information-hero-copy">
            <h1>${title}</h1>
            <p>${lead}</p>
          </div>
          <figure class="information-hero-visual" aria-hidden="true"><img src="./assets/${heroImage}" alt="" /></figure>
        </section>
        <section class="information-layout">
          <nav class="page-toc" aria-label="${label} sections">
            <strong>On this page</strong>
            ${toc.map(([href, text]) => `<a href="#${href}">${text}</a>`).join("\n            ")}
          </nav>
          <div class="information-content">
${content.trim()}
          </div>
        </section>
        <section class="aim-related-routes" aria-labelledby="${id}-related-routes"><h2 id="${id}-related-routes">Related Information</h2><nav aria-label="Related journal information"><a href="./aim-scope.html#aim-scope"><strong>Aims and Scope</strong><small>Review the journal's subject coverage</small></a><a href="./instructions-for-authors.html#instructions-for-authors"><strong>Guide for Authors</strong><small>Prepare a manuscript for submission</small></a><a href="./editorial-process.html#editorial-process"><strong>Peer Review Process</strong><small>Read the editorial workflow</small></a><a href="./submit-manuscript.html#submit-manuscript"><strong>Submit a Manuscript</strong><small>Go to the submission system</small></a></nav></section>
      </div>`;
}

const pages = new Map();

pages.set(
  "aim-scope.html",
  informationPage({
    id: "aim-scope",
    label: "Aims and Scope",
    title: "Aims and Scope",
    lead:
      "IJICS publishes recent fundamental contributions and innovative applications in intelligent control and systems.",
    facts: [
      fact("ISSN", "0218-7965"),
      fact("Publication frequency", "Quarterly"),
      fact("Established", "1993"),
      fact("Publishing model", "Open access"),
    ],
    toc: [
      ["journal-objective", "Aims"],
      ["scope-topics", "Scope"],
      ["contribution-types", "Types of Contributions"],
    ],
    content: `
            <article class="content-section" id="journal-objective">
              <h2>Aims</h2>
              <p>The International Journal of Intelligent Control and Systems (IJICS) is a peer-reviewed, open access international journal. It publishes articles describing recent fundamental contributions and innovative applications in the field of intelligent control and intelligent systems. Its objective is to disseminate important and leading-edge information in this new field in a timely fashion.</p>
            </article>
            <article class="content-section" id="scope-topics">
              <h2>Scope</h2>
              <p>IJICS covers theoretical and practical aspects of intelligent technologies and knowledge-based systems. The scope includes, but is not limited to:</p>
              <div class="scope-grid">
                <div class="scope-item"><strong>Robotics and automation</strong><span>Robotics, automation, and intelligent machines.</span></div>
                <div class="scope-item"><strong>Intelligent control and learning-based methods</strong><span>Control, optimization, estimation, learning, and decision methods.</span></div>
                <div class="scope-item"><strong>Systems, coordination, and integration</strong><span>System architecture, integration, coordination, modeling, and simulation.</span></div>
                <div class="scope-item"><strong>Computing platforms and intelligent systems</strong><span>Hardware, software, and embedded platforms for intelligent systems.</span></div>
              </div>
            </article>
            <article class="content-section" id="contribution-types">
              <h2>Types of Contributions</h2>
              <div class="two-column-copy">
                <div><h3>Research Articles</h3><p>Original research that advances the theory, methods, architecture, modeling, or control of intelligent systems.</p></div>
                <div><h3>Reviews and Communications</h3><p>Authoritative reviews, communications, and letters addressing significant developments in the journal's scope.</p></div>
              </div>
            </article>`,
  })
);

pages.set(
  "open-access.html",
  informationPage({
    id: "open-access",
    label: "Open Access",
    title: "Open Access",
    lead:
      "Consult the current IJICS website and Editorial Office for the journal's applicable access and reuse terms.",
    facts: [
      fact("Access", "Immediate and permanent"),
      fact("Article processing charge", "No charge"),
      fact("License", "CC BY 4.0"),
      fact("Copyright", "Retained by authors"),
    ],
    toc: [
      ["access-model", "Open Access Policy"],
      ["reuse-rights", "Licensing"],
      ["author-copyright", "Copyright"],
      ["third-party-material", "Third-Party Material"],
    ],
    content: `
            <article class="content-section" id="access-model">
              <h2>Open Access Policy</h2>
              <p>IJICS is a Diamond Open Access journal. All published articles are immediately and permanently freely available online to all users, and publishing in this journal is entirely free of charge for all authors.</p>
              <div class="key-callout"><strong>No subscription. No author publishing fee.</strong><span>Readers can access published articles without payment, and authors are not charged to publish.</span></div>
            </article>
            <article class="content-section" id="reuse-rights">
              <h2>Licensing</h2>
              <p>IJICS serves authors and academic communities by publishing high-quality, peer-reviewed content under Creative Commons licenses, which promote the maximum dissemination and use of licensed materials. All articles published in IJICS are distributed under the latest version of the CC BY license.</p>
              <p>Under this license, users are free to read, download, copy, distribute, and adapt the material for any purpose, provided that appropriate credit is given to the original author(s) and the journal.</p>
              <a class="text-action" href="https://creativecommons.org/licenses/by/4.0/">Read the CC BY 4.0 legal terms</a>
            </article>
            <article class="content-section" id="author-copyright">
              <h2>Author Copyright</h2>
              <p>Authors retain the full copyright of their work. The CC BY license governs how readers and other users may reuse the published article.</p>
            </article>
            <article class="content-section" id="third-party-material">
              <h2>Third-Party Material</h2>
              <p>The CC BY license does not apply to third-party materials, including figures, tables, or text, that are subject to separate copyright notices. Unless such content is also under CC BY or an equally permissive license, authors are responsible for obtaining any necessary permissions from the original copyright holder.</p>
            </article>`,
  })
);

pages.set(
  "author-center.html",
  informationPage({
    id: "author-center",
    label: "For Authors",
    title: "For Authors",
    lead:
      "Start with the requirements, download a template, check the review process, and submit through the official IJICS system.",
    facts: [
      fact("Submission", "Online"),
      fact("Preferred file", "PDF"),
      fact("Peer review", "Double-anonymous"),
      fact("Article processing charge", "No charge"),
    ],
    toc: [
      ["prepare", "Prepare"],
      ["templates", "Templates"],
      ["submit", "Submit"],
      ["review-process", "Peer Review Process"],
      ["after-acceptance", "After Acceptance"],
    ],
    content: `
            <article class="content-section" id="prepare">
              <h2>Prepare your manuscript</h2>
              <p>Check scope fit, originality, author approval, article type, structure, language, references, figures, and tables before submission.</p>
              <a class="text-action" href="./instructions-for-authors.html#manuscript-preparation">View manuscript requirements</a>
            </article>
            <article class="content-section" id="templates">
              <h2>Manuscript Templates</h2>
              <div class="download-grid">
                <a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.docx"><strong>Word template</strong><span>DOCX, official IJICS file</span></a>
                <a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.zip"><strong>LaTeX template</strong><span>ZIP, official IJICS file</span></a>
              </div>
            </article>
            <article class="content-section" id="submit">
              <h2>Submit a Manuscript</h2>
              <p>All prospective authors must submit manuscripts electronically. DOC and PDF files are accepted, and PDF is preferred.</p>
              <a class="primary-action" href="https://www.ijics.cn/user/login">Go to Submission System</a>
            </article>
            <article class="content-section" id="review-process">
              <h2>Peer Review Process</h2>
              <p>Published articles are reviewed by a minimum of two independent reviewers through a double-anonymous peer review process. Articles are screened for similarity before acceptance.</p>
              <a class="text-action" href="./editorial-process.html#editorial-process">View editorial process</a>
            </article>
            <article class="content-section" id="after-acceptance">
              <h2>Proofs and Corrections</h2>
              <p>Corresponding authors receive a PDF proof for final review. Corrections should be returned within 5 days, and major manuscript changes are not permitted at this stage.</p>
            </article>`,
  })
);

pages.set(
  "article-processing-charge.html",
  informationPage({
    id: "article-processing-charge",
    label: "Article Processing Charges",
    title: "Article Processing Charges",
    lead:
      "The current IJICS website states that the journal does not charge fees for manuscript processing at present.",
    facts: [
      fact("Article processing charge", "No charge"),
      fact("Submission fee", "No charge"),
      fact("Publication fee", "No charge"),
      fact("Publishing model", "Open access"),
    ],
    toc: [
      ["fee-policy", "Fee Policy"],
      ["open-access-model", "Open Access Model"],
      ["related-policies", "Related Policies"],
    ],
    content: `
            <article class="content-section" id="fee-policy">
              <h2>Fee Policy</h2>
              <p>Publishing in IJICS is entirely free of charge for all authors. The journal does not charge an article processing charge under its current Diamond Open Access policy.</p>
              <div class="fee-display"><span>Article Processing Charge</span><strong>0</strong><small>No payment is required from authors.</small></div>
            </article>
            <article class="content-section" id="open-access-model">
              <h2>Open Access Model</h2>
              <p>All published articles are immediately and permanently freely available online to all users. Access for readers and publication for authors are both free of charge.</p>
            </article>
            <article class="content-section" id="related-policies">
              <h2>Related Policies</h2>
              <div class="inline-links"><a href="./open-access.html#open-access">Open Access</a><a href="./licensing-terms.html#licensing-terms">Licensing</a><a href="./copyright-terms.html#copyright-terms">Copyright</a></div>
            </article>`,
  })
);

pages.set(
  "licensing-terms.html",
  informationPage({
    id: "licensing-terms",
    label: "Licensing",
    title: "Licensing",
    lead:
      "Check the copyright agreement and the terms attached to the published article before reuse.",
    facts: [
      fact("Copyright agreement", "Required before publication"),
      fact("Public license", "Confirm per article"),
      fact("Third-party material", "Permission may be required"),
      fact("Contact", "ijics@caa.org.cn"),
    ],
    toc: [
      ["license-policy", "Article License"],
      ["permitted-use", "Permitted Reuse"],
      ["attribution", "Attribution Requirements"],
      ["exceptions", "Third-Party Material"],
    ],
    content: `
            <article class="content-section" id="license-policy">
              <h2>Article License</h2>
              <p>All articles published in IJICS are distributed under the latest version of the Creative Commons Attribution license.</p>
              <a class="text-action" href="https://creativecommons.org/licenses/by/4.0/">View CC BY 4.0</a>
            </article>
            <article class="content-section" id="permitted-use">
              <h2>Permitted Reuse</h2>
              <p>Users are free to read, download, copy, distribute, and adapt IJICS material for any purpose.</p>
              <div class="permission-grid"><span>Read</span><span>Download</span><span>Copy</span><span>Distribute</span><span>Adapt</span></div>
            </article>
            <article class="content-section" id="attribution">
              <h2>Attribution Requirements</h2>
              <p>Appropriate credit must be given to the original author(s) and the journal when material is reused.</p>
            </article>
            <article class="content-section" id="exceptions">
              <h2>Third-Party Material</h2>
              <p>Material covered by a separate copyright notice is not automatically included under CC BY. Authors must obtain permission when the relevant third-party material is not available under CC BY or an equally permissive license.</p>
            </article>`,
  })
);

pages.set(
  "copyright-terms.html",
  informationPage({
    id: "copyright-terms",
    label: "Copyright",
    title: "Copyright",
    lead:
      "All authors must sign the IJICS Transfer of Copyright Agreement before publication.",
    facts: [
      fact("Copyright owner", "Author(s)"),
      fact("Publication license", "CC BY 4.0"),
      fact("Permitted reuse", "With attribution"),
      fact("Third-party material", "Permission may be required"),
    ],
    toc: [
      ["author-rights", "Author Copyright"],
      ["reader-reuse", "Reuse Under CC BY 4.0"],
      ["third-party-rights", "Third-Party Material"],
    ],
    content: `
            <article class="content-section" id="author-rights"><h2>Author Copyright</h2><p>Authors retain the full copyright of their work.</p></article>
            <article class="content-section" id="reader-reuse"><h2>Reuse Under CC BY 4.0</h2><p>Published articles are distributed under CC BY 4.0. Users may read, download, copy, distribute, and adapt the material for any purpose when appropriate credit is given to the original author(s) and IJICS.</p></article>
            <article class="content-section" id="third-party-rights"><h2>Third-Party Material</h2><p>Figures, tables, text, and other material carrying a separate copyright notice may not be covered by the article license. Authors are responsible for obtaining the permissions needed to include and publish that material.</p></article>`,
  })
);

pages.set(
  "publication-ethics.html",
  informationPage({
    id: "publication-ethics",
    label: "Publishing Ethics",
    title: "Publishing Ethics",
    lead:
      "IJICS requires unpublished work and applies quantitative checks for similarity, self-citation, and reference-source concentration.",
    facts: [
      fact("Originality", "Required"),
      fact("Duplicate submission", "Prohibited"),
      fact("Overall similarity", "Below 30%"),
      fact("Single-source similarity", "Below 15%"),
    ],
    toc: [
      ["plagiarism", "Originality and Plagiarism"],
      ["duplicate-submission", "Duplicate and Concurrent Submission"],
      ["authorship", "Authorship and Contributorship"],
      ["ai-use", "Use of Generative AI"],
    ],
    content: `
            <article class="content-section" id="plagiarism"><h2>Originality and Plagiarism</h2><p>Manuscripts must be original. All submissions are screened for plagiarism before peer review. High similarity scores may result in rejection without review.</p></article>
            <article class="content-section" id="duplicate-submission"><h2>Duplicate and Concurrent Submission</h2><p>Manuscripts must not be submitted simultaneously to multiple journals or published elsewhere in English or any other language.</p></article>
            <article class="content-section" id="authorship"><h2>Authorship and Contributorship</h2><p>All listed authors must have made substantial contributions to the work and have approved the final version. The corresponding author is responsible for ensuring this.</p></article>
            <article class="content-section" id="ai-use"><h2>Use of Generative AI</h2><p>If generative AI tools were used in manuscript preparation, including text generation, data analysis, or figure creation, this must be declared in the manuscript. AI tools cannot be listed as authors.</p></article>`,
  })
);

pages.set(
  "editorial-process.html",
  informationPage({
    id: "editorial-process",
    label: "Peer Review Process",
    title: "Peer Review Process",
    lead:
      "IJICS uses independent review, author and reviewer anonymity, similarity screening, and a defined proof-correction stage.",
    facts: [
      fact("Peer review model", "Double-anonymous"),
      fact("Reviewers per manuscript", "Minimum two"),
      fact("Similarity screening", "Before acceptance"),
      fact("Proof corrections", "Within 5 days"),
    ],
    toc: [
      ["submission-received", "Initial Submission"],
      ["peer-review", "Peer Review"],
      ["communication", "Editorial Decisions and Revisions"],
      ["proof-correction", "Proofs and Corrections"],
    ],
    content: `
            <article class="content-section" id="submission-received"><h2>Initial Submission</h2><p>Manuscripts are submitted through the IJICS online system. The submitting author receives an acknowledgment email and a manuscript reference number.</p></article>
            <article class="content-section" id="peer-review"><h2>Peer Review</h2><p>Each manuscript considered for publication is reviewed by a minimum of two independent reviewers. Reviewer identities are not known to the authors, and author identities are not known to the reviewers. Articles are screened for similarity before acceptance.</p></article>
            <article class="content-section" id="communication"><h2>Editorial Decisions and Revisions</h2><p>Editorial decisions and requests for revision are communicated to the corresponding author by email. Authors may contact the Editorial Office to inquire about manuscript status.</p></article>
            <article class="content-section" id="proof-correction"><h2>Proofs and Corrections</h2><p>Corresponding authors receive a PDF proof for final review. Corrections should be submitted within 5 days. Major changes to the manuscript are not permitted at this stage.</p></article>`,
  })
);

pages.set(
  "submit-manuscript.html",
  informationPage({
    id: "submit-manuscript",
    label: "Submit a Manuscript",
    title: "Submit a Manuscript",
    lead:
      "Prepare a DOC or PDF manuscript, verify the author list, and submit electronically through the IJICS login page.",
    facts: [
      fact("Submission system", "Online"),
      fact("Accepted file formats", "DOC and PDF"),
      fact("Preferred format", "PDF"),
      fact("Official website", "www.ijics.cn"),
    ],
    toc: [
      ["before-submit", "Before You Submit"],
      ["submission-steps", "Submission Process"],
      ["reviewer-suggestions", "Suggested Reviewers"],
      ["official-login", "Submission System"],
    ],
    content: `
            <article class="content-section" id="before-submit">
              <h2>Before You Submit</h2>
              <ul class="check-list"><li>The manuscript is original and not under consideration elsewhere.</li><li>The manuscript fits the IJICS Aims and Scope.</li><li>All authors have read and approved the submitted version.</li><li>The manuscript follows the preparation requirements.</li></ul>
            </article>
            <article class="content-section" id="submission-steps">
              <h2>Submission Process</h2>
              <ol class="numbered-flow"><li><strong>Register and sign in.</strong><span>Use the IJICS online submission system.</span></li><li><strong>Upload the manuscript.</strong><span>DOC and PDF files are accepted; PDF is preferred.</span></li><li><strong>Check the author list.</strong><span>Confirm that every co-author is included and the file is correctly uploaded.</span></li><li><strong>Receive the manuscript number.</strong><span>The system sends an acknowledgment email after a successful submission.</span></li><li><strong>Monitor editorial correspondence.</strong><span>Editorial decisions and requests for revision are sent by email.</span></li></ol>
            </article>
            <article class="content-section" id="reviewer-suggestions"><h2>Suggested Reviewers</h2><p>Authors may suggest 2-3 potential reviewers by providing names, institutional email addresses, and reasons for suggestion. Suggested reviewers should not have co-authored or collaborated with the authors within the past three years.</p></article>
            <article class="content-section" id="official-login"><h2>Submission System</h2><p>Check that the browser address begins with <strong>https://www.ijics.cn/</strong> before entering account credentials.</p><a class="primary-action" href="https://www.ijics.cn/user/login">Go to Submission System</a></article>`,
  })
);

pages.set(
  "reviewers.html",
  informationPage({
    id: "reviewers",
    label: "Guide for Reviewers",
    title: "Guide for Reviewers",
    lead:
      "Reviewers can verify the invitation, read the IJICS review model, and enter the official review system from one page.",
    facts: [
      fact("Peer review model", "Double-anonymous"),
      fact("Reviewers per manuscript", "Minimum two"),
      fact("Editorial screening", "Similarity check"),
      fact("Reviewer portal", "IJICS submission system"),
    ],
    toc: [
      ["review-rules", "Reviewer Responsibilities"],
      ["review-requirements", "Review Criteria"],
      ["invitation", "Verifying a Review Invitation"],
      ["review-login", "Reviewer Login"],
    ],
    content: `
            <article class="content-section" id="review-rules"><h2>Reviewer Responsibilities</h2><p>IJICS uses a double-anonymous peer review process. Reviewers must preserve manuscript confidentiality, disclose relevant competing interests, and provide an objective and evidence-based assessment.</p></article>
            <article class="content-section" id="review-requirements"><h2>Review Criteria</h2><ul class="check-list"><li>Assess whether the manuscript fits the journal scope.</li><li>Consider originality, scholarly significance, and methodological soundness.</li><li>Check whether the main contribution is clear and supported.</li><li>Protect the confidentiality of the peer review process.</li><li>Raise potential plagiarism or duplicate-publication concerns.</li></ul></article>
            <article class="content-section" id="invitation"><h2>Verifying a Review Invitation</h2><p>Confirm that the invitation identifies IJICS and provides a manuscript title or reference. Use the official website and Editorial Office contact when a message or link is unclear.</p><div class="identity-check"><span>Official website</span><strong>www.ijics.cn</strong><span>Editorial Office</span><strong>ijics@caa.org.cn</strong></div></article>
            <article class="content-section" id="review-login"><h2>Reviewer Login</h2><p>The IJICS online system is used for journal workflow access.</p><a class="primary-action" href="https://www.ijics.cn/user/login">Log In as a Reviewer</a></article>`,
  })
);

pages.set(
  "anti-fraud.html",
  informationPage({
    id: "anti-fraud",
    label: "Anti-Fraud Notice",
    title: "Anti-Fraud Notice",
    lead:
      "Check the official domain, Editorial Office email, login address, and fee policy before sharing files or credentials.",
    facts: [
      fact("Official website", "www.ijics.cn"),
      fact("Editorial Office email", "ijics@caa.org.cn"),
      fact("Submission system", "/user/login"),
      fact("Article processing charge", "No charge"),
    ],
    toc: [
      ["official-identity", "Official Contact Information"],
      ["login-check", "Submission System"],
      ["payment-check", "Fees and Payment Requests"],
      ["report-message", "Reporting Suspicious Communications"],
    ],
    content: `
            <article class="content-section" id="official-identity"><h2>Official Contact Information</h2><p>The journal website is <strong>www.ijics.cn</strong>. The public Editorial Office email is <strong>ijics@caa.org.cn</strong>.</p></article>
            <article class="content-section" id="login-check"><h2>Submission System</h2><p>The journal workflow login is located at <strong>https://www.ijics.cn/user/login</strong>. Check the browser address before entering credentials.</p></article>
            <article class="content-section" id="payment-check"><h2>Fees and Payment Requests</h2><p>IJICS is a Diamond Open Access journal, and publishing is free of charge for all authors. Do not act on a payment request that conflicts with the public Article Processing Charges page.</p></article>
            <article class="content-section" id="report-message"><h2>Reporting Suspicious Communications</h2><p>Forward the sender address, link, and manuscript reference to the Editorial Office. Do not include account passwords or payment credentials.</p><a class="primary-action" href="mailto:ijics@caa.org.cn">Email the Editorial Office</a></article>`,
  })
);

pages.set(
  "publisher-information.html",
  informationPage({
    id: "publisher-information",
    label: "Journal Information",
    title: "Journal Information",
    lead:
      "Publication details, society affiliation, publishing model, editorial governance, and contact information.",
    facts: [
      fact("Abbreviation", "IJICS"),
      fact("ISSN", "0218-7965"),
      fact("Publication frequency", "Quarterly"),
      fact("Established", "1993"),
    ],
    toc: [
      ["journal-identity", "Publication Details"],
      ["society-listing", "Society Affiliation"],
      ["publishing-model", "Publishing Model"],
      ["editorial-governance", "Editorial Governance"],
      ["editorial-office", "Editorial Office"],
    ],
    content: `
            <article class="content-section" id="journal-identity"><h2>Publication Details</h2><dl class="metadata-list"><div><dt>Full title</dt><dd>The International Journal of Intelligent Control and Systems</dd></div><div><dt>Abbreviation</dt><dd>IJICS</dd></div><div><dt>ISSN</dt><dd>0218-7965</dd></div><div><dt>CN</dt><dd>10-1942/TP</dd></div><div><dt>Publication frequency</dt><dd>Quarterly</dd></div><div><dt>Established</dt><dd>1993</dd></div><div><dt>Official website</dt><dd><a href="https://www.ijics.cn/">https://www.ijics.cn/</a></dd></div></dl></article>
            <article class="content-section" id="society-listing"><h2>Society Affiliation</h2><p>IJICS is listed among the journals of the Chinese Association of Automation (CAA).</p><a class="text-action" href="https://www.caa.org.cn/Content/320.html">View the CAA Journal Listing</a></article>
            <article class="content-section" id="publishing-model"><h2>Publishing Model</h2><p>IJICS operates as a Diamond Open Access journal. Articles are immediately and permanently available online, authors are not charged a publication fee, and articles are distributed under CC BY 4.0 while authors retain copyright.</p><div class="inline-links"><a href="./open-access.html#open-access">Open Access</a><a href="./article-processing-charge.html#article-processing-charge">Article Processing Charges</a><a href="./licensing-terms.html#licensing-terms">Licensing</a></div></article>
            <article class="content-section" id="editorial-governance"><h2>Editorial Governance</h2><p>The public Editorial Board page identifies the Editor-in-Chief, Deputy Editors, Associate Editors, and their institutional affiliations. Editorial Office contact information is provided below.</p><a class="text-action" href="./editorial-board.html#editorial-board">View the Editorial Board</a></article>
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
    title: "Editorial Board",
    lead:
      "The IJICS Editorial Board is presented with each member's institutional affiliation and country.",
    facts: [
      fact("Editor-in-Chief", "Fei-Yue Wang"),
      fact("Board structure", "Three editorial roles"),
      fact("Affiliations", "Listed by institution"),
      fact("Editorial Office", "ijics@caa.org.cn"),
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
            <article class="content-section" id="associate-editors"><h2>Associate Editors</h2><details class="board-disclosure"><summary>View All Associate Editors</summary><ul class="editor-directory">${associateEditors.map(([name, affiliation]) => `<li><strong>${name}</strong><span>${affiliation}</span></li>`).join("")}</ul></details></article>
            <article class="content-section" id="editorial-office"><h2>Editorial Office</h2><dl class="metadata-list"><div><dt>Email</dt><dd><a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a></dd></div><div><dt>Telephone</dt><dd>010-61943066</dd></div><div><dt>Address</dt><dd>Room 1505, Satellite Building, No. 63 Zhichun Road, Haidian District, Beijing 100190, China</dd></div></dl></article>`,
  })
);

pages.set(
  "instructions-for-authors.html",
  informationPage({
    id: "instructions-for-authors",
    label: "Guide for Authors",
    title: "Guide for Authors",
    lead:
      "Use this guide to check originality, article type, structure, files, submission, peer review, proof correction, and ethics.",
    facts: [
      fact("Language", "English"),
      fact("Preferred file", "PDF"),
      fact("Keywords", "4-6"),
      fact("Peer review", "Double-anonymous"),
    ],
    toc: [
      ["submission-checklist", "Submission Checklist"],
      ["manuscript-preparation", "Manuscript Preparation"],
      ["article-types", "Article Types"],
      ["templates", "Manuscript Templates"],
      ["manuscript-structure", "Manuscript Structure"],
      ["submission-process", "Submission Process"],
    ],
    className: "long-guide",
    content: `
            <article class="content-section" id="submission-checklist"><h2>Submission Checklist</h2><div class="check-grid"><div>The manuscript has not been published previously and is not under consideration elsewhere.</div><div>The manuscript falls within the IJICS Aims and Scope.</div><div>All authors have read and approved the submitted version.</div><div>The manuscript follows the preparation requirements below.</div></div><section class="integrity-screening" aria-labelledby="integrity-screening-title"><div class="integrity-screening-intro"><h3 id="integrity-screening-title">Originality and Similarity Screening</h3><p>All submissions are screened for similarity, author self-citation, and reference-source concentration. Authors should follow the thresholds below. Manuscripts that substantially exceed them may be rejected.</p></div><ol class="integrity-thresholds"><li><div class="integrity-numbers"><strong>&lt;30%</strong><span>overall similarity</span><strong>&lt;15%</strong><span>from any single source</span></div><p>The overall similarity should be less than 30%, and the similarity matched to any single source should be less than 15%.</p></li><li><div class="integrity-numbers"><strong>&lt;20%</strong><span>author self-citations</span></div><p>Self-citations from all authors should account for less than 20% of the total number of references.</p></li><li><div class="integrity-numbers"><strong>&lt;20%</strong><span>from one source</span></div><p>References from a single source, such as one author, journal, or conference, should account for less than 20% of the reference list.</p></li></ol></section></article>
            <details class="content-disclosure" open id="manuscript-preparation"><summary>Manuscript Preparation</summary><div class="disclosure-body"><h3>Language</h3><p>Manuscripts must be written in clear English and should be checked carefully for grammar, spelling, and consistency before submission. Manuscripts that cannot be evaluated reliably because of language or presentation problems may be returned without external review.</p><h3>Originality and Significance</h3><p>Manuscripts should present an original and significant contribution relevant to the journal's scope. Authors should state the contribution clearly, support it with appropriate evidence, and avoid unnecessary repetition across the Abstract, Introduction, and Conclusions.</p><h3 id="article-types">Article Types</h3><div class="article-type-grid"><div><strong>Research Article</strong><p>A complete report of original research, including the research question, methods, evidence, results, and contribution.</p></div><div><strong>Communications and Letters</strong><p>A concise report of original and significant results intended for timely dissemination.</p></div><div><strong>New AI and New Society</strong><p>A concise article addressing an emerging problem, significant finding, or new method or model. Recommended length: no more than 3 journal pages.</p></div></div><h3 id="templates">Manuscript Templates and File Formats</h3><p>Manuscripts should be clear and concise, claims should be supported by reliable evidence, and unsupported self-assessment should be avoided. PDF is preferred for submission; DOC files are also accepted.</p><div class="download-grid"><a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.docx"><strong>Word template</strong><span>DOCX, official IJICS file</span></a><a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.zip"><strong>LaTeX template</strong><span>ZIP, official IJICS file</span></a></div></div></details>
            <details class="content-disclosure" id="manuscript-structure"><summary>Manuscript Structure</summary><div class="disclosure-body"><ol class="structured-list"><li><strong>Title page</strong><span>Concise title, all author names, affiliations, email addresses, and the corresponding author.</span></li><li><strong>Abstract</strong><span>Purpose, methods, main results, and conclusions. Avoid references, figures, and tables.</span></li><li><strong>Keywords</strong><span>Provide 4-6 keywords.</span></li><li><strong>Introduction</strong><span>Background, research questions, and significance.</span></li><li><strong>Materials and Methods</strong><span>Methods described in enough detail to support reproducibility.</span></li><li><strong>Results and Discussion</strong><span>Presentation and interpretation of findings.</span></li><li><strong>Conclusions</strong><span>Key findings and implications.</span></li><li><strong>Acknowledgments</strong><span>Funding sources, fund name, and fund number.</span></li><li><strong>References</strong><span>All cited references in ascending numerical order.</span></li><li><strong>Author biography</strong><span>Color photograph, education, current position, and research interests.</span></li></ol></div></details>
            <details class="content-disclosure"><summary>Equations, Figures, Tables, and References</summary><div class="disclosure-body"><h3>Equations</h3><p>Label equations in order. Refer to them as Eq. (1) or Eqs. (1) and (2). Variables are usually italicized and must be defined at first use.</p><h3>Figures and Tables</h3><p>Number figures and tables in the order in which they are cited. Provide a concise caption for each item and place it after the first citation. Vector graphics or high-resolution figure files of at least 300 dpi are recommended.</p><h3>Reference Style</h3><div class="reference-examples"><p><strong>Journal:</strong> D. Payton, R. Estkowski, and M. Howard, Compound behaviors in pheromone robotics, Robot. Auton. Syst., 2003, 44(3), 229-240.</p><p><strong>Book:</strong> B. Ran and D. E. Boyce, Modeling Dynamic Transportation Network. Berlin, Germany: Springer-Verlag, 1996, 69-83.</p><p><strong>Website:</strong> J. M. Tour, Image processing toolbox for use with MATLAB: User's guide [Online], http://www.mathworks.com, 3 November 2006.</p></div></div></details>
            <details class="content-disclosure" id="submission-process"><summary>Submission Process and Suggested Reviewers</summary><div class="disclosure-body"><ol class="numbered-flow"><li><strong>Register and sign in.</strong><span>Use the IJICS online submission system.</span></li><li><strong>Upload the manuscript.</strong><span>DOC and PDF files are accepted; PDF is preferred.</span></li><li><strong>Check authorship.</strong><span>Confirm that the manuscript is uploaded correctly and all co-authors are included.</span></li><li><strong>Receive the manuscript number.</strong><span>The system sends an acknowledgment email after a successful submission.</span></li><li><strong>Monitor editorial correspondence.</strong><span>Editorial decisions and requests for revision are sent by email.</span></li></ol><h3>Suggested Reviewers</h3><p>Authors may suggest 2-3 potential reviewers with names, institutional email addresses, and reasons for suggestion. Suggested reviewers should not have co-authored or collaborated with the authors within the past three years.</p><a class="primary-action" href="https://www.ijics.cn/user/login">Go to Submission System</a></div></details>
            <details class="content-disclosure"><summary>Peer Review, Proofs, and Publishing Ethics</summary><div class="disclosure-body"><h3>Peer Review</h3><p>Each manuscript considered for publication is reviewed by a minimum of two independent reviewers using a double-anonymous process. Articles are screened for similarity before acceptance.</p><h3>Proofs and Corrections</h3><p>Corresponding authors receive a PDF proof for final review. Corrections should be submitted within 5 days. Major manuscript changes are not permitted at this stage.</p><div class="inline-links"><a href="./editorial-process.html#editorial-process">Peer Review Process</a><a href="./publication-ethics.html#publication-ethics">Publishing Ethics</a></div></div></details>`,
  })
);

const pageTitles = new Map([
  ["open-access.html", "Open Access | IJICS"],
  ["article-processing-charge.html", "Article Processing Charges | IJICS"],
  ["licensing-terms.html", "Licensing | IJICS"],
  ["copyright-terms.html", "Copyright | IJICS"],
  ["publication-ethics.html", "Publishing Ethics | IJICS"],
  ["editorial-process.html", "Peer Review Process | IJICS"],
  ["submit-manuscript.html", "Submit a Manuscript | IJICS"],
  ["reviewers.html", "Guide for Reviewers | IJICS"],
  ["anti-fraud.html", "Anti-Fraud Notice | IJICS"],
  ["publisher-information.html", "Journal Information | IJICS"],
  ["editorial-board.html", "Editorial Board | IJICS"],
  ["instructions-for-authors.html", "Guide for Authors | IJICS"],
]);

for (const [file, content] of pages) {
  const path = join(demoDir, file);
  const html = await readFile(path, "utf8");
  const start = html.indexOf('      <div class="content-flow');
  const end = html.indexOf("\n    </main>", start);
  if (start === -1 || end === -1) {
    throw new Error(`Could not locate content-flow in ${file}`);
  }
  const rebuilt = `${html.slice(0, start)}${content}${html.slice(end)}`;
  const pageTitle = pageTitles.get(file);
  const next = pageTitle ? rebuilt.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`) : rebuilt;
  await writeFile(path, next);
}

console.log(`Rebuilt ${pages.size} information pages.`);
