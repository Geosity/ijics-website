<script setup>
import {assetUrl} from '../api/assetUrl.js';
defineProps({article:{type:Object,required:true}});
const metric=value=>Number.isFinite(value)&&value>=0?value:'—';
</script>
<template>
 <article class="article-card issue-article-card">
  <figure v-if="article.figure" class="article-figure"><RouterLink :to="'/articles/'+article.id"><img :src="assetUrl(article.figure)" :alt="article.figureCaption||'Figure from the published article.'" loading="lazy"/></RouterLink></figure>
  <div class="article-card-body"><p class="type-label">{{article.category}}</p><h2><RouterLink :to="'/articles/'+article.id">{{article.title}}</RouterLink></h2><p class="article-authors">{{article.authors.join(', ')}}</p><p class="article-meta"><span v-if="article.pages">Pages {{article.pages}}</span><span v-if="article.doi"> | DOI: {{article.doi}}</span></p>
   <div class="article-metrics" aria-label="Article usage"><span class="article-metric" :title="'Reads as of '+article.metricsAsOf"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><strong>{{metric(article.readCount)}}</strong></span><span class="article-metric" :title="'Downloads as of '+article.metricsAsOf"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/></svg><strong>{{metric(article.downloadCount)}}</strong></span></div>
  </div>
  <div class="article-actions" aria-label="Article actions"><RouterLink :to="'/articles/'+article.id">View Article</RouterLink><a v-if="article.pdfUrl" :href="article.pdfUrl">Download PDF</a><RouterLink class="cite-action" :to="{path:'/articles/'+article.id,query:{cite:'1'}}">Cite This Paper</RouterLink></div>
 </article>
</template>
