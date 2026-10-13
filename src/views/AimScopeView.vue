<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">


      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Aims and Scope</strong></nav>
        <header class="subpage-heading" id="aim-scope"><h1>Aims and Scope</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Aims and Scope sections">
            <strong>Table of Contents</strong>
            <a href="#journal-objective">Aims</a>
            <a href="#scope-topics">Scope</a>
            <a href="#contribution-types">Types of Contributions</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="journal-objective">
              <h2>Aims</h2>
              <p>The International Journal of Intelligent Control and Systems (IJICS) is an international, peer-reviewed journal publishing original research, reviews, communications, and scholarly perspectives in intelligent control and systems.</p>
            </article>
            <article class="content-section" id="scope-topics">
              <h2>Scope</h2>
              <p>The journal welcomes theoretical, computational, experimental, and applied contributions. Topics include, but are not limited to:</p>
              <div class="scope-grid">
                <div class="scope-item"><strong>Robotics and automation</strong><span>Robotics, manufacturing automation, intelligent machines, and human-machine interfaces.</span></div>
                <div class="scope-item"><strong>Intelligent control and learning-based methods</strong><span>Machine learning, fuzzy logic, neural networks, genetic algorithms, pattern recognition, and evolutionary computation for intelligent control.</span></div>
                <div class="scope-item"><strong>Systems, coordination, and integration</strong><span>System architectures, design, modeling and simulation, integration and coordination, self-organization, and multisensor fusion.</span></div>
                <div class="scope-item"><strong>Computing platforms and intelligent systems</strong><span>Intelligent devices and instruments, real-time architectures, rapid prototyping, simulation software, and CAD/CAM tools.</span></div>
              </div>
            </article>
            <article class="content-section" id="contribution-types">
              <h2>Types of Contributions</h2>
              <div class="article-type-grid">
                <div><h3>Research Articles</h3><p>Original research that advances the theory, methods, architecture, modeling, or control of intelligent systems.</p></div>
                <div><h3>Reviews and Communications</h3><p>Authoritative reviews, communications, and letters addressing significant developments in the journal's scope.</p></div>
                <div><h3>New AI and New Society (NANS)</h3><p>Short contributions on emerging topics, research findings, methods, and models. Recommended length: no more than 3 journal pages.</p></div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
</template>
