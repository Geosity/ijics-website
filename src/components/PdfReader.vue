<script setup>
defineProps({url:{type:String,required:true},title:{type:String,required:true}});
</script>
<template><div class="pdf-reading-card"><div><p class="type-label">Published article · PDF</p><p>Read the complete article with its figures and publication information.</p></div><a class="btn-primary" :href="url" target="_blank" rel="noopener noreferrer" :aria-label="'Read full text: '+title">Read full text ↗</a></div></template>
<style>.pdf-reading-card{display:flex;flex-wrap:wrap;align-items:center;gap:18px;padding:20px;border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:6px;background:white}.pdf-reading-card>div{flex:1;min-width:180px}.pdf-reading-card p{margin:0 0 8px}.pdf-reading-card .btn-primary{display:inline-block;white-space:nowrap}</style>
