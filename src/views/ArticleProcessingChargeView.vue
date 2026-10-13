<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Article Processing Charges</strong></nav>
        <header class="subpage-heading" id="article-processing-charge"><h1>Article Processing Charges</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Article Processing Charges sections">
            <strong>Table of Contents</strong>
            <a href="#fee-policy">Fee Policy</a>
            <a href="#open-access-model">Future Changes</a>
            <a href="#related-policies">Related Policies</a>
          </nav>
          <div class="information-content">
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
              <div class="inline-links"><RouterLink to="/open-access#open-access">Open Access</RouterLink><RouterLink to="/licensing-terms#licensing-terms">Licensing</RouterLink><RouterLink to="/copyright-terms#copyright-terms">Copyright</RouterLink></div>
            </article>
          </div>
        </section>
      </div>
    </main>
</template>
