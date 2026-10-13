<script setup>
import {ref,onMounted,onUnmounted} from 'vue';
import {useRoute} from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
const route=useRoute(),toast=ref('');let timer;
function showToast(e){toast.value=e.detail;clearTimeout(timer);timer=setTimeout(()=>toast.value='',2400)}
onMounted(()=>document.addEventListener('ijics-toast',showToast));onUnmounted(()=>{clearTimeout(timer);document.removeEventListener('ijics-toast',showToast)});
</script>
<template><div :class="{'article-design-page':route.name==='article'}"><a class="skip-link" href="#main">Skip to content</a><SiteHeader/><RouterView/><SiteFooter/><div class="toast" :class="{'is-visible':toast}" role="status" aria-live="polite">{{toast}}</div></div></template>
