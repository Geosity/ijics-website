<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Copyright</strong></nav>
        <header class="subpage-heading" id="copyright-terms"><h1>Copyright and Permissions</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Copyright sections">
            <strong>Table of Contents</strong>
            <a href="#author-rights">Copyright Agreement</a>
            <a href="#reader-reuse">Author Rights</a>
            <a href="#third-party-rights">Third-Party Permissions</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="author-rights"><h2>Copyright Agreement</h2><p>All authors must sign the IJICS Transfer of Copyright Agreement before an accepted paper can be published.</p></article>
            <article class="content-section" id="reader-reuse"><h2>Author Rights</h2><p>The copyright agreement enables the publisher to protect the published work while preserving the authors' proprietary rights. Please refer to the agreement for the rights retained by authors.</p></article>
            <article class="content-section" id="third-party-rights"><h2>Third-Party Permissions</h2><p>Authors are responsible for obtaining permission from the copyright holder to reproduce figures or other material for which copyright already exists.</p></article>
          </div>
        </section>
      </div>
    </main>
</template>
