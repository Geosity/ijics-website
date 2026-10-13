<script setup>
import {ref,computed,watch,onMounted,onUnmounted} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import ArticleList from '../components/ArticleList.vue';
import snapshots from '../data/articles.json' with {type:'json'};
import issues from '../data/issues.json' with {type:'json'};
import {fetchArticles} from '../api/articleClient.js';
import {filterArticles} from '../api/articleFilters.js';
const route=useRoute(),router=useRouter(),q=ref(String(route.query.q||'')),type=ref(String(route.query.type||'all')),issue=ref(String(route.query.issue||'')),records=ref(snapshots),error=ref(''),loading=ref(false);let controller;
const filtered=computed(()=>filterArticles(records.value,{q:q.value,type:type.value,issue:issue.value}));
watch(()=>route.fullPath,()=>{q.value=String(route.query.q||'');type.value=String(route.query.type||'all');issue.value=String(route.query.issue||'');});
function search(){const query={};if(q.value.trim())query.q=q.value.trim();if(type.value!=='all')query.type=type.value;if(issue.value)query.issue=issue.value;router.push({path:'/search-articles',query});}
async function refresh(){controller?.abort();controller=new AbortController();loading.value=true;error.value='';try{records.value=await fetchArticles({signal:controller.signal});}catch(e){if(e.name!=='AbortError')error.value='Current article data is unavailable. Showing dated records.';}finally{loading.value=false;}}
onMounted(refresh);onUnmounted(()=>controller?.abort());
</script>
<template><main id="main" class="page-shell"><div class="content-flow"><section class="page-section" id="search-articles"><p class="type-label">Article catalogue</p><h1>Search Articles</h1><p>Search by title, author, DOI or keyword.</p><form class="search-controls" role="search" @submit.prevent="search"><label>Search articles<input v-model="q" type="search" placeholder="Title, author, DOI, keyword"/></label><label>Article type<select v-model="type" @change="search"><option value="all">All article types</option><option value="editorial">New AI and New Society</option><option value="articles">Research Articles</option><option value="communication">Communications</option></select></label><label>Issue<select v-model="issue" @change="search"><option value="">All issues</option><option v-for="entry in issues" :key="entry.id" :value="String(entry.id)">{{entry.title}}</option></select></label><button type="submit">Search</button></form><p v-if="loading" role="status">Loading current articles…</p><p v-if="error" class="data-warning" role="status">{{error}} <button type="button" @click="refresh">Try again</button></p><p role="status">{{filtered.length}} {{filtered.length===1?'article':'articles'}} found</p><ArticleList :articles="filtered" :show-filters="false"/></section></div></main></template>
