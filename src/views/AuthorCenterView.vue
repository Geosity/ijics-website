<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">


      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Author Center</strong></nav>
        <header class="subpage-heading" id="author-center"><h1>Author Center</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Author Center sections">
            <strong>Table of Contents</strong>
            <a href="#prepare">Prepare</a>
            <a href="#templates">Templates</a>
            <a href="#submit">Submit</a>
            <a href="#review-process">Peer Review</a>
            <a href="#after-acceptance">After Acceptance</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="prepare">
              <h2>Prepare Your Manuscript</h2>
              <p>Before submitting, check that your manuscript fits the journal's scope and meets the requirements for article type, originality, formatting, and author information.</p>
              <RouterLink class="text-action" to="/instructions-for-authors#manuscript-preparation">View submission guidelines</RouterLink>
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
              <RouterLink class="text-action" to="/editorial-process#editorial-process">Read about peer review</RouterLink>
            </article>
            <article class="content-section" id="after-acceptance">
              <h2>Proofs and Corrections</h2>
              <p>For instructions on correcting proofs and the applicable deadline, please contact the Editorial Office.</p>
              <p>Email: <a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a></p>
            </article>
          </div>
        </section>
      </div>
    </main>
</template>
