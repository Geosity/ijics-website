<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Licensing</strong></nav>
        <header class="subpage-heading" id="licensing-terms"><h1>Licensing and Reuse</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Licensing sections">
            <strong>Table of Contents</strong>
            <a href="#license-policy">Article License</a>
            <a href="#permitted-use">Permitted Reuse</a>
            <a href="#attribution">Attribution Requirements</a>
            <a href="#exceptions">Third-Party Material</a>
          </nav>
          <div class="information-content">
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
            </article>
          </div>
        </section>
      </div>
    </main>
</template>
