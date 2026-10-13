<script setup>
import {assetUrl} from '../api/assetUrl.js';
function openMenu(event){if(window.matchMedia('(hover: hover)').matches)event.currentTarget.open=true;}
function closeMenu(event){const menu=event.currentTarget;menu.open=false;if(event.type==='keydown')menu.querySelector('summary')?.focus();}
</script>
<template><header class="site-header">
      <div class="nav-shell">
        <RouterLink class="brand" aria-label="IJICS home" to="/#home">
          <img class="brand-logo" width="640" height="581" alt="IJICS" :src="assetUrl(&quot;/assets/ijics-header-psd.png?v=2&quot;)">
          <span class="brand-name">The International Journal of <br>Intelligent Control and Systems</span>
        </RouterLink>
        <nav class="section-shortcuts" aria-label="Primary navigation">
          <RouterLink to="/#home">Home</RouterLink>
          <details class="nav-menu" @keydown.esc.stop.prevent="closeMenu" @mouseenter="openMenu" @mouseleave="closeMenu">
            <summary>About the Journal</summary>
            <div class="nav-menu-panel">
              <RouterLink to="/aim-scope#aim-scope">Aims and Scope</RouterLink>
              <RouterLink to="/editorial-board#editorial-board">Editorial Board</RouterLink>
              <RouterLink to="/publisher-information#publisher-information">Journal Information</RouterLink>
              <RouterLink to="/publication-ethics#publication-ethics">Publishing Ethics</RouterLink>
            </div>
          </details>
          <details class="nav-menu" @keydown.esc.stop.prevent="closeMenu" @mouseenter="openMenu" @mouseleave="closeMenu">
            <summary>Articles</summary>
            <div class="nav-menu-panel">
              <RouterLink to="/#current-issue">Latest Issue</RouterLink>
              <RouterLink to="/forthcoming-issue#accepted">Early Access</RouterLink>
              <RouterLink to="/all-issues#all-issues">All Issues</RouterLink>
            </div>
          </details>
          <details class="nav-menu" @keydown.esc.stop.prevent="closeMenu" @mouseenter="openMenu" @mouseleave="closeMenu">
            <summary>Author Center</summary>
            <div class="nav-menu-panel">
              <RouterLink to="/author-center#author-center">Author Center</RouterLink>
              <RouterLink to="/instructions-for-authors#instructions-for-authors">Submission Guidelines</RouterLink>
              <RouterLink to="/editorial-process#editorial-process">Editorial Process</RouterLink>
            </div>
          </details>
          <RouterLink to="/search-articles#search-articles">Search Articles</RouterLink>
          <a class="nav-submit" href="https://www.ijics.cn/user/login">Submit a Manuscript</a>
        </nav>
      </div>

    </header></template>
