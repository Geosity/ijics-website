<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">


      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Editorial Board</strong></nav>
        <header class="subpage-heading" id="editorial-board"><h1>Editorial Board</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Editorial Board sections">
            <strong>Table of Contents</strong>
            <a href="#editor-in-chief">Editor-in-Chief</a>
            <a href="#deputy-editors">Deputy Editors</a>
            <a href="#associate-editors">Associate Editors</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="editor-in-chief"><h2>Editor-in-Chief</h2><div class="leader-card"><span class="leader-portrait leader-portrait-wang"><img alt="Fei-Yue Wang" width="192" height="202" :src="assetUrl(&quot;/assets/editor-fei-yue-wang.png&quot;)"></span><div><strong>Fei-Yue Wang</strong><span>Chinese Academy of Sciences, China</span></div></div></article>
            <article class="content-section" id="deputy-editors"><h2>Deputy Editors-in-Chief</h2><div class="leader-grid"><div class="leader-card"><span class="leader-portrait leader-portrait-chen"><img alt="C. L. Philip Chen" width="160" height="156" :src="assetUrl(&quot;/assets/editor-philip-chen.png&quot;)"></span><div><strong>C. L. Philip Chen</strong><span>South China University of Technology, China</span></div></div><div class="leader-card"><span class="leader-portrait leader-portrait-wei"><img alt="Qinglai Wei" width="124" height="124" :src="assetUrl(&quot;/assets/editor-qinglai-wei.png&quot;)"></span><div><strong>Qinglai Wei</strong><span>Chinese Academy of Sciences, China</span></div></div></div></article>
            <article class="content-section" id="associate-editors"><h2>Associate Editors</h2><details class="board-disclosure" open=""><summary>Associate Editors</summary><ul class="editor-directory"><li><strong>P. J. Antsaklis</strong><span>Notre Dame University, USA</span></li><li><strong>P. Bonissone</strong><span>GE Center for Research and Development, USA</span></li><li><strong>Y. B. Chen</strong><span>Purdue University at Indianapolis, USA</span></li><li><strong>C. W. de Silva</strong><span>University of British Columbia, Canada</span></li><li><strong>C. C. Hang</strong><span>National University of Singapore, Singapore</span></li><li><strong>H. Hashimoto</strong><span>University of Tokyo, Japan</span></li><li><strong>C. J. Harris</strong><span>University of Southampton, UK</span></li><li><strong>Y. C. Ho</strong><span>Harvard University, USA</span></li><li><strong>B. Hrúz</strong><span>Slovak University of Technology in Bratislava, Slovak Republic</span></li><li><strong>A. Kusiak</strong><span>University of Iowa, USA</span></li><li><strong>K. J. Kyriakopoulos</strong><span>National Technical University of Athens, Greece</span></li><li><strong>G. S. C. Lee</strong><span>National Science Foundation, USA</span></li><li><strong>S. Lee</strong><span>Sungkyunkwan University, Korea</span></li><li><strong>F. L. Lewis</strong><span>The University of Texas at Arlington, USA</span></li><li><strong>P. M. U. A. Lima</strong><span>Instituto Superior Técnico, Portugal</span></li><li><strong>D. Liu</strong><span>University of Illinois at Chicago, USA</span></li><li><strong>Y. X. Lu</strong><span>Chinese Academy of Sciences, China</span></li><li><strong>J. E. Mcinroy</strong><span>University of Wyoming, USA</span></li><li><strong>A. Nerode</strong><span>Cornell University, USA</span></li><li><strong>U. Ozguner</strong><span>Ohio State University, USA</span></li><li><strong>F. Pfeiffer</strong><span>Technische Universität München, Germany</span></li><li><strong>P. S. Schenker</strong><span>Jet Propulsion Laboratory, USA</span></li><li><strong>R. Z. Song</strong><span>University of Science and Technology Beijing, China</span></li><li><strong>Y. G. Tang</strong><span>Rowan University, USA</span></li><li><strong>T. J. Tarn</strong><span>Washington University, USA</span></li><li><strong>J. Wang</strong><span>Monmouth University, USA</span></li><li><strong>Z. S. Wang</strong><span>Northeastern University, China</span></li><li><strong>Z. Wang</strong><span>Beihang University, China</span></li><li><strong>W. M. Wonham</strong><span>University of Toronto, Canada</span></li><li><strong>Q. M. Yang</strong><span>Zhejiang University, China</span></li><li><strong>D. Zeng</strong><span>Chinese Academy of Sciences, China</span></li><li><strong>P. J. Zhang</strong><span>Tsinghua University, China</span></li><li><strong>Y. F. Zheng</strong><span>Ohio State University, USA</span></li><li><strong>M. C. Zhou</strong><span>New Jersey Institute of Technology, USA</span></li><li><strong>H. Zhu</strong><span>Nipissing University, Canada</span></li><li><strong>R. Zurawski</strong><span>Atut Technology, USA</span></li><li><strong>J. Zhang</strong><span>Wuhan University, China</span></li></ul></details></article>
          </div>
        </section>
      </div>
    </main>
</template>
