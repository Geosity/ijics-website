<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Publishing Ethics</strong></nav>
        <header class="subpage-heading" id="publication-ethics"><h1>Publishing Ethics</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Publishing Ethics sections">
            <strong>Table of Contents</strong>
            <a href="#plagiarism">Originality and Plagiarism</a>
            <a href="#duplicate-submission">Duplicate and Concurrent Submission</a>
            <a href="#self-citation">Author Self-Citation</a>
            <a href="#source-diversity">References to a Single Source</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="plagiarism"><h2>Originality and Plagiarism</h2><p>All submissions are screened for similarity. Overall similarity should remain below <strong class="ethics-percentage">30%</strong>, and similarity to any single source should remain below <strong class="ethics-percentage">15%</strong>.</p></article>
            <article class="content-section" id="duplicate-submission"><h2>Duplicate and Concurrent Submission</h2><p>Submitted manuscripts must not have been published or be under consideration by another journal in English or another language without the publisher's written consent.</p></article>
            <article class="content-section" id="self-citation"><h2>Author Self-Citation</h2><p>Self-citations from all authors should account for less than <strong class="ethics-percentage">20%</strong> of the references.</p></article>
            <article class="content-section" id="source-diversity"><h2>References to a Single Source</h2><p>References from one person, journal, conference, or other single source should account for less than <strong class="ethics-percentage">20%</strong> of the reference list.</p></article>
          </div>
        </section>
      </div>
    </main>
</template>
