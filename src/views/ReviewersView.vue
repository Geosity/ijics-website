<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Reviewer Guidelines</strong></nav>
        <header class="subpage-heading" id="reviewers"><h1>Reviewer Guidelines</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Reviewer Guidelines sections">
            <strong>Table of Contents</strong>
            <a href="#review-rules">Reviewer Responsibilities</a>
            <a href="#review-requirements">Review Criteria</a>
            <a href="#invitation">Verifying a Review Invitation</a>
            <a href="#review-login">Reviewer Login</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="review-rules"><h2>Reviewer Responsibilities</h2><p>IJICS uses a single-blind peer review process. Reviewers must preserve manuscript confidentiality, disclose relevant competing interests, and provide an objective, evidence-based assessment.</p></article>
            <article class="content-section" id="review-requirements"><h2>Review Criteria</h2><ul class="check-list"><li>Assess whether the manuscript fits the journal scope.</li><li>Consider originality, scholarly significance, and methodological soundness.</li><li>Assess whether the conclusions are supported by the methods and results.</li><li>Protect the confidentiality of the peer review process.</li><li>Report suspected plagiarism or duplicate publication to the editor.</li></ul></article>
            <article class="content-section" id="invitation"><h2>Verifying a Review Invitation</h2><p>Review invitations should identify the journal and manuscript. If you are unsure whether an invitation is genuine, contact the Editorial Office using the details below.</p><div class="identity-check"><span>Official website</span><strong>www.ijics.cn</strong><span>Editorial Office</span><strong>ijics@caa.org.cn</strong></div></article>
            <article class="content-section" id="review-login"><h2>Reviewer Login</h2><p>Access review assignments through the IJICS online submission system.</p><a class="primary-action" href="https://www.ijics.cn/user/login">Log in as a reviewer</a></article>
          </div>
        </section>
      </div>
    </main>
</template>
