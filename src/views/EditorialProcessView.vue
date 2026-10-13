<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Editorial Process</strong></nav>
        <header class="subpage-heading" id="editorial-process"><h1>Editorial Process</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Editorial Process sections">
            <strong>Table of Contents</strong>
            <a href="#submission-received">Initial Submission</a>
            <a href="#peer-review">Peer Review</a>
            <a href="#communication">Editorial Decisions and Revisions</a>
            <a href="#proof-correction">Proofs and Corrections</a>
            <a href="#apc-policy">Article Processing Charges</a>
            <a href="#publishing-ethics">Publishing Ethics</a>
            <a href="#open-access-policy">Open Access Policy</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="submission-received"><h2>Initial Submission</h2><p>Manuscripts are submitted through the IJICS online system. The submitting author receives an acknowledgment email and a manuscript reference number.</p></article>
            <article class="content-section" id="peer-review"><h2>Single-Blind Peer Review</h2><p>Each published article is reviewed by at least two independent reviewers. Reviewers remain anonymous to authors. All submissions are screened for similarity.</p></article>
            <article class="content-section" id="communication"><h2>Editorial Decisions and Revisions</h2><p>Editorial decisions and revision requests are communicated to the corresponding author by email. Authors may contact the Editorial Office to inquire about manuscript status.</p></article>
            <article class="content-section" id="proof-correction"><h2>Proofs and Corrections</h2><p>For instructions on correcting proofs and the applicable deadline, please contact the Editorial Office.</p><p>Email: <a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a></p></article>
            <article class="content-section editorial-policy-summary" id="apc-policy"><h2>Article Processing Charges</h2><p>IJICS currently charges no manuscript processing fee. Any changes to publication charges will be announced on the journal website.</p><RouterLink class="text-action" to="/article-processing-charge#article-processing-charge">View the current APC policy</RouterLink></article>
            <article class="content-section editorial-policy-summary" id="publishing-ethics"><h2>Publishing Ethics</h2><p>Authors must comply with the journal's policies on originality, submission to other journals, similarity, and citation practices.</p><RouterLink class="text-action" to="/publication-ethics#publication-ethics">View the full publishing ethics policy</RouterLink></article>
            <article class="content-section editorial-policy-summary" id="open-access-policy"><h2>Open Access Policy</h2><p>Published articles are available on the IJICS website. Access and reuse are subject to the copyright and license notice accompanying each article.</p><RouterLink class="text-action" to="/open-access#open-access">View the full open access policy</RouterLink></article>
          </div>
        </section>
      </div>
    </main>
</template>
