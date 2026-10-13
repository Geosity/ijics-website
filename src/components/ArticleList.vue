<script setup>
import {ref,computed} from 'vue';
import ArticleCard from './ArticleCard.vue';
import {groupForArticle,filterArticles} from '../api/articleFilters.js';
const props=defineProps({articles:{type:Array,default:()=>[]},showFilters:{type:Boolean,default:true},initialType:{type:String,default:'all'}});
const type=ref(props.initialType),sort=ref('issue');
const types=[['all','Selected'],['editorial','New AI and New Society'],['articles','Research Articles'],['communication','Communications']];
const filtered=computed(()=>{const records=filterArticles(props.articles,{type:type.value});if(sort.value==='title')return records.toSorted((a,b)=>a.title.localeCompare(b.title));if(sort.value==='type')return records.toSorted((a,b)=>String(a.category).localeCompare(String(b.category)));return records;});
const count=token=>token==='all'?props.articles.length:props.articles.filter(a=>groupForArticle(a)===token).length;
</script>
<template><div v-if="showFilters" class="article-type-switcher"><div class="article-type-tabs" aria-label="Article type shortcuts"><button v-for="[token,label] in types" :key="token" type="button" class="article-type-tab" :class="{'is-active':type===token}" :aria-pressed="type===token" @click="type=token">{{label}} <span>({{count(token)}})</span></button></div><label class="article-sort"><span>Sort by:</span><select v-model="sort" aria-label="Sort latest issue articles"><option value="issue">Issue order</option><option value="type">Article type</option><option value="title">Title A-Z</option></select></label></div><div class="article-list issue-card-grid" aria-live="polite"><ArticleCard v-for="article in filtered" :key="article.id" :article="article"/></div><p v-if="!filtered.length" class="empty-state">No articles match the current search and filters.</p></template>
