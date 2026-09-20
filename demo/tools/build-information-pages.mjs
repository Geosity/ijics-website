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

function informationPage({ id, label, title, toc, content, className = "" }) {
  return `      <div class="content-flow information-page guided-information-page ${className}">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><a href="./index.html#home">Home</a><span>/</span><strong>${label}</strong></nav>
        <header class="subpage-heading" id="${id}"><h1>${title}</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="${label} sections">
            <strong>Table of Contents</strong>
            ${toc.map(([href, text]) => `<a href="#${href}">${text}</a>`).join("\n            ")}
          </nav>
          <div class="information-content">
${content.trim()}
          </div>
        </section>
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
      "IJICS provides an international forum for theoretical advances and practical applications in intelligent control and systems.",
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
              <p>The International Journal of Intelligent Control and Systems (IJICS) is an international, peer-reviewed journal publishing original research, reviews, communications, and scholarly perspectives in intelligent control and systems.</p>
            </article>
            <article class="content-section" id="scope-topics">
              <h2>Scope</h2>
              <p>The journal welcomes theoretical, computational, experimental, and applied contributions. Topics include, but are not limited to:</p>
              <div class="scope-grid">
                <div class="scope-item"><strong>Robotics and automation</strong><span>Robotics, manufacturing automation, intelligent machines, and human-machine interfaces.</span></div>
                <div class="scope-item"><strong>Intelligent control and learning-based methods</strong><span>Machine learning, fuzzy logic, neural networks, genetic algorithms, pattern recognition, and evolutionary computation for intelligent control.</span></div>
                <div class="scope-item"><strong>Systems, coordination, and integration</strong><span>System architectures, design, modeling and simulation, integration and coordination, self-organization, and multisensor fusion.</span></div>
                <div class="scope-item"><strong>Computing platforms and intelligent systems</strong><span>Intelligent devices and instruments, real-time architectures, rapid prototyping, simulation software, and CAD/CAM tools.</span></div>
              </div>
            </article>
            <article class="content-section" id="contribution-types">
              <h2>Types of Contributions</h2>
              <div class="article-type-grid">
                <div><h3>Research Articles</h3><p>Original research that advances the theory, methods, architecture, modeling, or control of intelligent systems.</p></div>
                <div><h3>Reviews and Communications</h3><p>Authoritative reviews, communications, and letters addressing significant developments in the journal's scope.</p></div>
                <div><h3>New AI and New Society (NANS)</h3><p>Short contributions on emerging topics, research findings, methods, and models. Recommended length: no more than 3 journal pages.</p></div>
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
      "Information on access to IJICS articles, publication charges, and copyright and licensing terms.",
    facts: [
      fact("Access", "Immediate and permanent"),
      fact("Article processing charge", "No charge"),
      fact("License", "See individual article"),
      fact("Copyright agreement", "Required"),
    ],
    toc: [
      ["access-model", "Access and Availability"],
      ["reuse-rights", "Article Processing Charges"],
      ["author-copyright", "Licensing and Copyright"],
      ["third-party-material", "Third-Party Material"],
    ],
    content: `
            <article class="content-section" id="access-model">
              <h2>Access and Availability</h2>
              <p>Published articles can be accessed through the IJICS website. Please refer to the notice accompanying each article for its access and reuse terms.</p>
            </article>
            <article class="content-section" id="reuse-rights">
              <h2>Article Processing Charges</h2>
              <p>IJICS currently <strong class="fee-emphasis">does not charge fees</strong> for manuscript processing. Any changes to publication charges will be announced on the journal website.</p>
              <a class="text-action" href="./article-processing-charge.html#article-processing-charge">View the current fee policy</a>
            </article>
            <article class="content-section" id="author-copyright">
              <h2>Licensing and Copyright</h2>
              <p>The Information for Authors requires a Transfer of Copyright Agreement before publication. Readers should follow the copyright and license notice attached to the relevant article when reusing material.</p>
            </article>
            <article class="content-section" id="third-party-material">
              <h2>Third-Party Material</h2>
              <p>Authors are responsible for obtaining permission to reproduce figures, tables, text, or other material for which copyright already exists.</p>
            </article>`,
  })
);

pages.set(
  "author-center.html",
  informationPage({
    id: "author-center",
    label: "Author Center",
    title: "Author Center",
    lead:
      "Submission guidelines, manuscript templates, and information on peer review and publication.",
    facts: [
      fact("Submission", "Online"),
      fact("Preferred file", "PDF"),
      fact("Peer review", "Single-blind"),
      fact("Article processing charge", "No charge"),
    ],
    toc: [
      ["prepare", "Prepare"],
      ["templates", "Templates"],
      ["submit", "Submit"],
      ["review-process", "Peer Review"],
      ["after-acceptance", "After Acceptance"],
    ],
    content: `
            <article class="content-section" id="prepare">
              <h2>Prepare Your Manuscript</h2>
              <p>Before submitting, check that your manuscript fits the journal's scope and meets the requirements for article type, originality, formatting, and author information.</p>
              <a class="text-action" href="./instructions-for-authors.html#manuscript-preparation">View submission guidelines</a>
            </article>
            <article class="content-section" id="templates">
              <h2>Manuscript Templates</h2>
              <div class="download-grid">
                <a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.docx"><strong>Word template</strong><span>Word format (.docx)</span></a>
                <a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.zip"><strong>LaTeX template</strong><span>LaTeX source files (.zip)</span></a>
              </div>
            </article>
            <article class="content-section" id="submit">
              <h2>Submit a Manuscript</h2>
              <p>Submit manuscripts through the IJICS online submission system. Files may be submitted in DOC or PDF format; PDF is preferred.</p>
              <a class="primary-action" href="https://www.ijics.cn/user/login">Submit a Manuscript</a>
            </article>
            <article class="content-section" id="review-process">
              <h2>Peer Review</h2>
              <p>IJICS uses single-blind peer review: reviewers remain anonymous to authors. Each published article is reviewed by at least two independent reviewers.</p>
              <a class="text-action" href="./editorial-process.html#editorial-process">Read about peer review</a>
            </article>
            <article class="content-section" id="after-acceptance">
              <h2>Proofs and Corrections</h2>
              <p>For instructions on correcting proofs and the applicable deadline, please contact the Editorial Office.</p>
              <p>Email: <a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a></p>
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
      "IJICS currently charges no manuscript processing fee.",
    facts: [
      fact("Current processing fee", "None"),
      fact("Policy status", "Subject to change"),
      fact("Official source", "IJICS fee page"),
      fact("Contact", "ijics@caa.org.cn"),
    ],
    toc: [
      ["fee-policy", "Fee Policy"],
      ["open-access-model", "Future Changes"],
      ["related-policies", "Related Policies"],
    ],
    content: `
            <article class="content-section" id="fee-policy">
              <h2>Fee Policy</h2>
              <p>Currently, IJICS does not charge fees for manuscript processing.</p>
              <div class="fee-display"><span>Current Manuscript Processing Fee</span><strong>0</strong><small>No processing fee is charged at present.</small></div>
            </article>
            <article class="content-section" id="open-access-model">
              <h2>Future Changes</h2>
              <p>A publication fee may be introduced in the future. Any changes will be announced on the journal website.</p>
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
    title: "Licensing and Reuse",
    lead:
      "Check the copyright agreement and the terms attached to the published article before reuse.",
    facts: [
      fact("Copyright agreement", "Required before publication"),
      fact("Article terms", "See individual article"),
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
              <p>Please refer to the copyright and license notice accompanying each article for its terms of use.</p>
            </article>
            <article class="content-section" id="permitted-use">
              <h2>Permitted Reuse</h2>
              <p>Reuse must comply with the license or copyright notice accompanying the article.</p>
            </article>
            <article class="content-section" id="attribution">
              <h2>Attribution Requirements</h2>
              <p>Where reuse is permitted, cite the original article and comply with any additional conditions stated in its license or copyright notice.</p>
            </article>
            <article class="content-section" id="exceptions">
              <h2>Third-Party Material</h2>
              <p>Authors must obtain permission from the rights holder when reproducing copyrighted material that requires permission.</p>
            </article>`,
  })
);

pages.set(
  "copyright-terms.html",
  informationPage({
    id: "copyright-terms",
    label: "Copyright",
    title: "Copyright and Permissions",
    lead:
      "All authors must sign the IJICS Transfer of Copyright Agreement before publication.",
    facts: [
      fact("Copyright agreement", "Required"),
      fact("Agreement stage", "Before publication"),
      fact("Author rights", "See agreement"),
      fact("Third-party material", "Permission may be required"),
    ],
    toc: [
      ["author-rights", "Copyright Agreement"],
      ["reader-reuse", "Author Rights"],
      ["third-party-rights", "Third-Party Permissions"],
    ],
    content: `
            <article class="content-section" id="author-rights"><h2>Copyright Agreement</h2><p>All authors must sign the IJICS Transfer of Copyright Agreement before an accepted paper can be published.</p></article>
            <article class="content-section" id="reader-reuse"><h2>Author Rights</h2><p>The copyright agreement enables the publisher to protect the published work while preserving the authors' proprietary rights. Please refer to the agreement for the rights retained by authors.</p></article>
            <article class="content-section" id="third-party-rights"><h2>Third-Party Permissions</h2><p>Authors are responsible for obtaining permission from the copyright holder to reproduce figures or other material for which copyright already exists.</p></article>`,
  })
);

pages.set(
  "publication-ethics.html",
  informationPage({
    id: "publication-ethics",
    label: "Publishing Ethics",
    title: "Publishing Ethics",
    lead:
      "Requirements for originality, submission to other journals, similarity screening, and citation practices.",
    facts: [
      fact("Originality", "Required"),
      fact("Duplicate submission", "Prohibited"),
      fact("Overall similarity", "Below 30%"),
      fact("Single-source similarity", "Below 15%"),
    ],
    toc: [
      ["plagiarism", "Originality and Plagiarism"],
      ["duplicate-submission", "Duplicate and Concurrent Submission"],
      ["self-citation", "Author Self-Citation"],
      ["source-diversity", "References to a Single Source"],
    ],
    content: `
            <article class="content-section" id="plagiarism"><h2>Originality and Plagiarism</h2><p>All submissions are screened for similarity. Overall similarity should remain below <strong class="ethics-percentage">30%</strong>, and similarity to any single source should remain below <strong class="ethics-percentage">15%</strong>.</p></article>
            <article class="content-section" id="duplicate-submission"><h2>Duplicate and Concurrent Submission</h2><p>Submitted manuscripts must not have been published or be under consideration by another journal in English or another language without the publisher's written consent.</p></article>
            <article class="content-section" id="self-citation"><h2>Author Self-Citation</h2><p>Self-citations from all authors should account for less than <strong class="ethics-percentage">20%</strong> of the references.</p></article>
            <article class="content-section" id="source-diversity"><h2>References to a Single Source</h2><p>References from one person, journal, conference, or other single source should account for less than <strong class="ethics-percentage">20%</strong> of the reference list.</p></article>`,
  })
);

pages.set(
  "editorial-process.html",
  informationPage({
    id: "editorial-process",
    label: "Editorial Process",
    title: "Editorial Process",
    lead:
      "Information on manuscript submission, single-blind peer review, editorial decisions, revisions, and proof correction.",
    heroTags: [
      "Single-blind peer review",
      "Publication Charges",
      "Open Access",
    ],
    facts: [
      fact("Peer review model", "Single-blind"),
      fact("Reviewers per manuscript", "Minimum two"),
      fact("Similarity screening", "Before acceptance"),
      fact("Proof corrections", "Contact the Editorial Office"),
    ],
    toc: [
      ["submission-received", "Initial Submission"],
      ["peer-review", "Peer Review"],
      ["communication", "Editorial Decisions and Revisions"],
      ["proof-correction", "Proofs and Corrections"],
      ["apc-policy", "Article Processing Charges"],
      ["publishing-ethics", "Publishing Ethics"],
      ["open-access-policy", "Open Access Policy"],
    ],
    content: `
            <article class="content-section" id="submission-received"><h2>Initial Submission</h2><p>Manuscripts are submitted through the IJICS online system. The submitting author receives an acknowledgment email and a manuscript reference number.</p></article>
            <article class="content-section" id="peer-review"><h2>Single-Blind Peer Review</h2><p>Each published article is reviewed by at least two independent reviewers. Reviewers remain anonymous to authors. All submissions are screened for similarity.</p></article>
            <article class="content-section" id="communication"><h2>Editorial Decisions and Revisions</h2><p>Editorial decisions and revision requests are communicated to the corresponding author by email. Authors may contact the Editorial Office to inquire about manuscript status.</p></article>
            <article class="content-section" id="proof-correction"><h2>Proofs and Corrections</h2><p>For instructions on correcting proofs and the applicable deadline, please contact the Editorial Office.</p><p>Email: <a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a></p></article>
            <article class="content-section editorial-policy-summary" id="apc-policy"><h2>Article Processing Charges</h2><p>IJICS currently charges no manuscript processing fee. Any changes to publication charges will be announced on the journal website.</p><a class="text-action" href="./article-processing-charge.html#article-processing-charge">View the current APC policy</a></article>
            <article class="content-section editorial-policy-summary" id="publishing-ethics"><h2>Publishing Ethics</h2><p>Authors must comply with the journal's policies on originality, submission to other journals, similarity, and citation practices.</p><a class="text-action" href="./publication-ethics.html#publication-ethics">View the full publishing ethics policy</a></article>
            <article class="content-section editorial-policy-summary" id="open-access-policy"><h2>Open Access Policy</h2><p>Published articles are available on the IJICS website. Access and reuse are subject to the copyright and license notice accompanying each article.</p><a class="text-action" href="./open-access.html#open-access">View the full open access policy</a></article>`,
  })
);

pages.set(
  "submit-manuscript.html",
  informationPage({
    id: "submit-manuscript",
    label: "Submit a Manuscript",
    title: "Submit a Manuscript",
    lead:
      "Review the submission requirements, prepare the manuscript files, and submit through the official IJICS system.",
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
              <ol class="numbered-flow"><li><strong>Register and sign in.</strong><span>Use the IJICS online submission system.</span></li><li><strong>Upload the manuscript.</strong><span>DOC and PDF files are accepted; PDF is preferred.</span></li><li><strong>Confirm author details.</strong><span>Confirm that every co-author is included and the file is correctly uploaded.</span></li><li><strong>Submission confirmation.</strong><span>The system sends an acknowledgment email after a successful submission.</span></li><li><strong>Editorial correspondence.</strong><span>Editorial decisions and requests for revision are sent by email.</span></li></ol>
            </article>
            <article class="content-section" id="reviewer-suggestions"><h2>Suggested Reviewers</h2><p>Authors may suggest 2-3 potential reviewers by providing names, institutional email addresses, and reasons for suggestion. Suggested reviewers should not have co-authored or collaborated with the authors within the past three years.</p></article>
            <article class="content-section" id="official-login"><h2>Submission System</h2><p>Check that the browser address begins with <strong>https://www.ijics.cn/</strong> before entering account credentials.</p><a class="primary-action" href="https://www.ijics.cn/user/login">Submit a Manuscript</a></article>`,
  })
);

pages.set(
  "reviewers.html",
  informationPage({
    id: "reviewers",
    label: "Reviewer Guidelines",
    title: "Reviewer Guidelines",
    lead:
      "Guidance on reviewer responsibilities, manuscript evaluation, confidentiality, and competing interests.",
    facts: [
      fact("Peer review model", "Single-blind"),
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
            <article class="content-section" id="review-rules"><h2>Reviewer Responsibilities</h2><p>IJICS uses a single-blind peer review process. Reviewers must preserve manuscript confidentiality, disclose relevant competing interests, and provide an objective, evidence-based assessment.</p></article>
            <article class="content-section" id="review-requirements"><h2>Review Criteria</h2><ul class="check-list"><li>Assess whether the manuscript fits the journal scope.</li><li>Consider originality, scholarly significance, and methodological soundness.</li><li>Assess whether the conclusions are supported by the methods and results.</li><li>Protect the confidentiality of the peer review process.</li><li>Report suspected plagiarism or duplicate publication to the editor.</li></ul></article>
            <article class="content-section" id="invitation"><h2>Verifying a Review Invitation</h2><p>Review invitations should identify the journal and manuscript. If you are unsure whether an invitation is genuine, contact the Editorial Office using the details below.</p><div class="identity-check"><span>Official website</span><strong>www.ijics.cn</strong><span>Editorial Office</span><strong>ijics@caa.org.cn</strong></div></article>
            <article class="content-section" id="review-login"><h2>Reviewer Login</h2><p>Access review assignments through the IJICS online submission system.</p><a class="primary-action" href="https://www.ijics.cn/user/login">Log in as a reviewer</a></article>`,
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
            <article class="content-section" id="official-identity"><h2>Official Contact Information</h2><p>The journal website is <strong>www.ijics.cn</strong>. Contact the Editorial Office at <strong>ijics@caa.org.cn</strong>.</p></article>
            <article class="content-section" id="login-check"><h2>Submission System</h2><p>The online submission system is located at <strong>https://www.ijics.cn/user/login</strong>. Check the browser address before entering credentials.</p></article>
            <article class="content-section" id="payment-check"><h2>Fees and Payment Requests</h2><p>IJICS currently charges no manuscript processing fee. Any future publication charges will be announced on the journal website. Contact the Editorial Office to verify a payment request.</p></article>
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
      "Publication details, society affiliation, and contact information for IJICS.",
    facts: [
      fact("Abbreviation", "IJICS"),
      fact("ISSN", "0218-7965"),
      fact("Publication frequency", "Quarterly"),
      fact("Established", "1993"),
    ],
    toc: [
      ["journal-identity", "Publication Details"],
      ["society-listing", "Society Affiliation"],
      ["publishing-model", "Article Processing Charges"],
      ["editorial-office", "Editorial Office"],
    ],
    content: `
            <article class="content-section" id="journal-identity"><h2>Publication Details</h2><dl class="metadata-list"><div><dt>Full title</dt><dd>The International Journal of Intelligent Control and Systems</dd></div><div><dt>Abbreviation</dt><dd>IJICS</dd></div><div><dt>ISSN</dt><dd>0218-7965</dd></div><div><dt>CN</dt><dd>10-1942/TP</dd></div><div><dt>Publication frequency</dt><dd>Quarterly</dd></div><div><dt>Established</dt><dd>1993</dd></div><div><dt>Official website</dt><dd><a href="https://www.ijics.cn/">https://www.ijics.cn/</a></dd></div></dl></article>
            <article class="content-section" id="society-listing"><h2>Society Affiliation</h2><p>IJICS is listed among the journals of the Chinese Association of Automation (CAA).</p><a class="text-action" href="https://www.caa.org.cn/Content/320.html">View the CAA journal listing</a></article>
            <article class="content-section" id="publishing-model"><h2>Article Processing Charges</h2><p>Currently, IJICS does not charge any fees for manuscript processing. If an article publishing fee is introduced in the future, IJICS will publish the change on the journal website.</p><div class="inline-links"><a href="./open-access.html#open-access">Open Access</a><a href="./article-processing-charge.html#article-processing-charge">Publication Charges</a></div></article>
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
      "The IJICS editorial team and their institutional affiliations.",
    facts: [
      fact("Editor-in-Chief", "Fei-Yue Wang"),
      fact("Editorial leadership", "Editor-in-Chief, Deputy Editors-in-Chief, and Associate Editors"),
      fact("Affiliations", "Listed by institution"),
      fact("Editorial Office", "ijics@caa.org.cn"),
    ],
    toc: [
      ["editor-in-chief", "Editor-in-Chief"],
      ["deputy-editors", "Deputy Editors"],
      ["associate-editors", "Associate Editors"],
    ],
    content: `
            <article class="content-section" id="editor-in-chief"><h2>Editor-in-Chief</h2><div class="leader-card"><span class="leader-portrait leader-portrait-wang"><img src="./assets/editor-fei-yue-wang.png" alt="Fei-Yue Wang" width="192" height="202" /></span><div><strong>Fei-Yue Wang</strong><span>Chinese Academy of Sciences, China</span></div></div></article>
            <article class="content-section" id="deputy-editors"><h2>Deputy Editors-in-Chief</h2><div class="leader-grid"><div class="leader-card"><span class="leader-portrait leader-portrait-chen"><img src="./assets/editor-philip-chen.png" alt="C. L. Philip Chen" width="160" height="156" /></span><div><strong>C. L. Philip Chen</strong><span>South China University of Technology, China</span></div></div><div class="leader-card"><span class="leader-portrait leader-portrait-wei"><img src="./assets/editor-qinglai-wei.png" alt="Qinglai Wei" width="124" height="124" /></span><div><strong>Qinglai Wei</strong><span>Chinese Academy of Sciences, China</span></div></div></div></article>
            <article class="content-section" id="associate-editors"><h2>Associate Editors</h2><details class="board-disclosure" open><summary>Associate Editors</summary><ul class="editor-directory">${associateEditors.map(([name, affiliation]) => `<li><strong>${name}</strong><span>${affiliation}</span></li>`).join("")}</ul></details></article>`,
  })
);

pages.set(
  "instructions-for-authors.html",
  informationPage({
    id: "instructions-for-authors",
    label: "Submission Guidelines",
    title: "Submission Guidelines",
    lead:
      "Consult these guidelines for article types, manuscript preparation, submission requirements, peer review, and post-acceptance procedures.",
    facts: [
      fact("Language", "English"),
      fact("Preferred file", "PDF"),
      fact("Keywords", "4-6"),
      fact("Peer review", "Single-blind"),
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
            <article class="content-section" id="submission-checklist"><h2>Submission Checklist</h2><div class="check-grid"><div>The manuscript has not been published previously and is not under consideration elsewhere.</div><div>The manuscript fits the IJICS Aims and Scope.</div><div>All authors have read and approved the submitted version.</div><div>The manuscript follows the preparation requirements below.</div></div><section class="integrity-screening" aria-labelledby="integrity-screening-title"><div class="integrity-screening-intro"><h3 id="integrity-screening-title">Originality and Similarity Screening</h3></div><ol class="integrity-thresholds"><li><div class="integrity-numbers"><strong>&lt;30%</strong><span>overall similarity</span></div><p>The overall similarity should be less than 30%.</p></li><li><div class="integrity-numbers"><strong>&lt;15%</strong><span>single-source similarity</span></div><p>Similarity to any single source should be less than 15%.</p></li><li><div class="integrity-numbers"><strong>&lt;20%</strong><span>author self-citations</span></div><p>References to work by any of the manuscript's authors should together account for less than 20% of the reference list.</p></li><li><div class="integrity-numbers"><strong>&lt;20%</strong><span>references to a single source</span></div><p>References from a single source, such as one author, journal, or conference, should account for less than 20% of the reference list.</p></li></ol><p class="integrity-screening-note">All submissions are screened for similarity, author self-citation, and concentration of citations from a single source. Authors should follow the thresholds above. Manuscripts that substantially exceed them may be rejected.</p></section></article>
            <details class="content-disclosure" open id="manuscript-preparation"><summary>Manuscript Preparation</summary><div class="disclosure-body"><h3>Language</h3><p>Manuscripts must be written in clear English and checked carefully for grammar, spelling, and consistency before submission. Manuscripts that cannot be evaluated reliably because of language or presentation problems may be returned without external review.</p><h3>Originality and Significance</h3><p>Manuscripts should present an original and significant contribution relevant to the journal's scope. Authors should state the contribution clearly, support it with appropriate evidence, and avoid unnecessary repetition across the Abstract, Introduction, and Conclusions.</p><h3 id="article-types">Article Types</h3><div class="article-type-grid"><div><strong>Research Article</strong><p>Original research articles presenting a clearly defined problem, rigorous methods, and results that advance intelligent control and systems.</p></div><div><strong>Communications and Letters</strong><p>Concise reports of original findings and technical developments within the scope of the journal.</p></div><div><strong>New AI and New Society</strong><p>Short contributions on emerging topics, research findings, methods, and models. Recommended length: no more than 3 journal pages.</p></div></div><h3 id="templates">Manuscript Templates and File Formats</h3><p>Prepare manuscripts in two-column format using the journal template. Write clearly and concisely and support conclusions with evidence. PDF is preferred for submission; DOC files are also accepted.</p><div class="download-grid"><a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.docx"><strong>Word template</strong><span>Word format (.docx)</span></a><a class="download-item" href="https://static.caa.org.cn/ijics-journal/documentation/Template.zip"><strong>LaTeX template</strong><span>LaTeX source files (.zip)</span></a></div></div></details>
            <details class="content-disclosure" id="manuscript-structure"><summary>Manuscript Structure</summary><div class="disclosure-body"><ol class="structured-list"><li><strong>Title Page</strong><span>Concise title, all author names, affiliations, email addresses, and the corresponding author.</span></li><li><strong>Abstract</strong><span>Summarize the objective, methods, principal results, and conclusions. Do not include references, figures, or tables.</span></li><li><strong>Keywords</strong><span>Provide 4-6 keywords.</span></li><li><strong>Introduction</strong><span>Background, research questions, and significance.</span></li><li><strong>Materials and Methods</strong><span>Methods described in enough detail to support reproducibility.</span></li><li><strong>Results and Discussion</strong><span>Presentation and interpretation of findings.</span></li><li><strong>Conclusions</strong><span>Key findings and implications.</span></li><li><strong>Acknowledgments</strong><span>Identify funding agencies, funding programs, and grant numbers.</span></li><li><strong>References</strong><span>List references in numerical order of first citation in the text.</span></li><li><strong>Author Biography</strong><span>Provide a color photograph and a brief biography covering education, current affiliation, and research interests.</span></li></ol></div></details>
            <details class="content-disclosure"><summary>Equations, Figures, Tables, and References</summary><div class="disclosure-body"><h3>Equations</h3><p>Label equations in order. Refer to them as Eq. (1) or Eqs. (1) and (2). Variables are usually italicized and must be defined at first use.</p><h3>Figures and Tables</h3><p>Number figures and tables in the order in which they are cited. Provide a concise caption for each item and place it after the first citation. Vector graphics or high-resolution figure files of at least 300 dpi are recommended.</p><h3>Reference Style</h3><div class="reference-examples"><p><strong>Journal:</strong> D. Payton, R. Estkowski, and M. Howard, Compound behaviors in pheromone robotics, Robot. Auton. Syst., 2003, 44(3), 229-240.</p><p><strong>Book:</strong> B. Ran and D. E. Boyce, Modeling Dynamic Transportation Network. Berlin, Germany: Springer-Verlag, 1996, 69-83.</p><p><strong>Website:</strong> J. M. Tour, Image processing toolbox for use with MATLAB: User's guide [Online], http://www.mathworks.com, 3 November 2006.</p></div></div></details>
            <details class="content-disclosure" id="submission-process"><summary>Submission Process and Suggested Reviewers</summary><div class="disclosure-body"><ol class="numbered-flow"><li><strong>Register and sign in.</strong><span>Use the IJICS online submission system.</span></li><li><strong>Upload the manuscript.</strong><span>DOC and PDF files are accepted; PDF is preferred.</span></li><li><strong>Confirm author details.</strong><span>Confirm that the manuscript is uploaded correctly and all co-authors are included.</span></li><li><strong>Submission confirmation.</strong><span>The system sends an acknowledgment email after a successful submission.</span></li><li><strong>Editorial correspondence.</strong><span>Editorial decisions and requests for revision are sent by email.</span></li></ol><h3>Suggested Reviewers</h3><p>Authors may suggest 2-3 potential reviewers with names, institutional email addresses, and reasons for suggestion. Suggested reviewers should not have co-authored or collaborated with the authors within the past three years.</p><a class="primary-action" href="https://www.ijics.cn/user/login">Submit a Manuscript</a></div></details>`,
  })
);

const pageTitles = new Map([
  ["open-access.html", "Open Access | IJICS"],
  ["article-processing-charge.html", "Article Processing Charges | IJICS"],
  ["licensing-terms.html", "Licensing and Reuse | IJICS"],
  ["copyright-terms.html", "Copyright and Permissions | IJICS"],
  ["publication-ethics.html", "Publishing Ethics | IJICS"],
  ["editorial-process.html", "Editorial Process | IJICS"],
  ["submit-manuscript.html", "Submit a Manuscript | IJICS"],
  ["reviewers.html", "Reviewer Guidelines | IJICS"],
  ["anti-fraud.html", "Anti-Fraud Notice | IJICS"],
  ["publisher-information.html", "Journal Information | IJICS"],
  ["editorial-board.html", "Editorial Board | IJICS"],
  ["instructions-for-authors.html", "Submission Guidelines | IJICS"],
  ["author-center.html", "Author Center | IJICS"],
]);

const pageDescriptions = new Map([
  ["open-access.html", "IJICS information on article access, publication fees, licensing, copyright agreements, and third-party permissions."],
  ["article-processing-charge.html", "Current IJICS manuscript-processing fee policy and notice of possible future changes."],
  ["licensing-terms.html", "IJICS guidance on article-specific licensing, permitted reuse, attribution, and third-party permissions."],
  ["copyright-terms.html", "IJICS copyright agreement, author rights, and third-party permission requirements."],
  ["publication-ethics.html", "IJICS publishing ethics requirements for originality, concurrent submission, similarity, author self-citation, and citation of individual sources."],
  ["editorial-process.html", "IJICS editorial workflow, single-blind peer review, article processing charges, publishing ethics, open access information, revisions, and proofs."],
  ["submit-manuscript.html", "Official IJICS manuscript submission requirements, file formats, author checks, and submission system."],
  ["reviewers.html", "IJICS reviewer responsibilities, assessment criteria, invitation verification, and reviewer login."],
  ["anti-fraud.html", "IJICS guidance for verifying official contacts, submission links, fee requests, and suspicious communications."],
  ["publisher-information.html", "IJICS publication details, society affiliation, and official contact information."],
  ["editorial-board.html", "IJICS editorial leadership, board members, and institutional affiliations."],
  ["instructions-for-authors.html", "IJICS submission guidelines covering article types, manuscript preparation, files, peer review, and post-acceptance procedures."],
  ["author-center.html", "IJICS author resources, manuscript templates, peer review information, and online submission system."],
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
  let next = pageTitle ? rebuilt.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`) : rebuilt;
  const pageDescription = pageDescriptions.get(file);
  if (pageDescription) {
    next = next.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${pageDescription}" />`);
  }
  await writeFile(path, next);
}

console.log(`Rebuilt ${pages.size} information pages.`);
