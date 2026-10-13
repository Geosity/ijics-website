<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Open Access</strong></nav>
        <header class="subpage-heading" id="open-access"><h1>Open Access</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Open Access sections">
            <strong>Table of Contents</strong>
            <a href="#access-model">Access and Availability</a>
            <a href="#reuse-rights">Article Processing Charges</a>
            <a href="#author-copyright">Licensing and Copyright</a>
            <a href="#third-party-material">Third-Party Material</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="access-model">
              <h2>Access and Availability</h2>
              <p>Published articles can be accessed through the IJICS website. Please refer to the notice accompanying each article for its access and reuse terms.</p>
            </article>
            <article class="content-section" id="reuse-rights">
              <h2>Article Processing Charges</h2>
              <p>IJICS currently <strong class="fee-emphasis">does not charge fees</strong> for manuscript processing. Any changes to publication charges will be announced on the journal website.</p>
              <RouterLink class="text-action" to="/article-processing-charge#article-processing-charge">View the current fee policy</RouterLink>
            </article>
            <article class="content-section" id="author-copyright">
              <h2>Licensing and Copyright</h2>
              <p>The Information for Authors requires a Transfer of Copyright Agreement before publication. Readers should follow the copyright and license notice attached to the relevant article when reusing material.</p>
            </article>
            <article class="content-section" id="third-party-material">
              <h2>Third-Party Material</h2>
              <p>Authors are responsible for obtaining permission to reproduce figures, tables, text, or other material for which copyright already exists.</p>
            </article>
          </div>
        </section>
      </div>
    </main>
</template>
