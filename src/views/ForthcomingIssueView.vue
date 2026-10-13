<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow">
        <section class="page-section">
          <div class="section-intro"><h1>Early Access Articles</h1><p>Articles will appear here when they are published online ahead of issue assignment.</p></div>
          <div class="empty-notice" id="accepted"><strong>No Early Access articles are available at present</strong><p>Browse the latest issue for published articles.</p></div>
          <div class="route-actions" id="browse-next"><RouterLink class="quiet-link" to="/#current-issue">Latest Issue</RouterLink><RouterLink class="quiet-link" to="/all-issues#all-issues">All Issues</RouterLink></div>
        </section>
      </div>
    </main>
</template>
