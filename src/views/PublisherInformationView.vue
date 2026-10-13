<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Journal Information</strong></nav>
        <header class="subpage-heading" id="publisher-information"><h1>Journal Information</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Journal Information sections">
            <strong>Table of Contents</strong>
            <a href="#journal-identity">Publication Details</a>
            <a href="#society-listing">Society Affiliation</a>
            <a href="#publishing-model">Article Processing Charges</a>
            <a href="#editorial-office">Editorial Office</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="journal-identity"><h2>Publication Details</h2><dl class="metadata-list"><div><dt>Full title</dt><dd>The International Journal of Intelligent Control and Systems</dd></div><div><dt>Abbreviation</dt><dd>IJICS</dd></div><div><dt>ISSN</dt><dd>0218-7965</dd></div><div><dt>CN</dt><dd>10-1942/TP</dd></div><div><dt>Publication frequency</dt><dd>Quarterly</dd></div><div><dt>Established</dt><dd>1993</dd></div><div><dt>Official website</dt><dd><a href="https://www.ijics.cn/">https://www.ijics.cn/</a></dd></div></dl></article>
            <article class="content-section" id="society-listing"><h2>Society Affiliation</h2><p>IJICS is listed among the journals of the Chinese Association of Automation (CAA).</p><a class="text-action" href="https://www.caa.org.cn/Content/320.html">View the CAA journal listing</a></article>
            <article class="content-section" id="publishing-model"><h2>Article Processing Charges</h2><p>Currently, IJICS does not charge any fees for manuscript processing. If an article publishing fee is introduced in the future, IJICS will publish the change on the journal website.</p><div class="inline-links"><RouterLink to="/open-access#open-access">Open Access</RouterLink><RouterLink to="/article-processing-charge#article-processing-charge">Publication Charges</RouterLink></div></article>
            <article class="content-section" id="editorial-office"><h2>Editorial Office</h2><dl class="metadata-list"><div><dt>Email</dt><dd><a href="mailto:ijics@caa.org.cn">ijics@caa.org.cn</a></dd></div><div><dt>Telephone</dt><dd>010-61943066</dd></div><div><dt>Address</dt><dd>Room 1505, Satellite Building, No. 63 Zhichun Road, Haidian District, Beijing 100190, China</dd></div></dl></article>
          </div>
        </section>
      </div>
    </main>
</template>
