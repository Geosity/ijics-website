import {createRouter,createMemoryHistory,createWebHistory} from 'vue-router';
import pages from './data/pages.json' with {type:'json'};
import {updateArticleMeta} from './api/articleMeta.js';
import HomeView from './views/HomeView.vue';
import ArticleDetailView from './views/ArticleDetailView.vue';
import SearchView from './views/SearchView.vue';
import ArchiveView from './views/ArchiveView.vue';
import NotFoundView from './views/NotFoundView.vue';
const views=import.meta.glob('./views/*View.vue',{eager:true,import:'default'});
const componentFor=page=>page.file==='index.html'?HomeView:page.file==='search-articles.html'?SearchView:page.file==='all-issues.html'?ArchiveView:views['./views/'+page.file.replace('.html','').split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join('')+'View.vue'];
export function makeRouter(ssr=false){
 const routes=pages.filter(p=>!['article-detail.html','copyright-license.html'].includes(p.file)).map(p=>({path:p.path,name:p.file,alias:p.file==='index.html'?'/index.html':'/'+p.file,component:componentFor(p),meta:{title:p.title,description:p.description}}));
 routes.push({path:'/copyright-license',alias:'/copyright-license.html',redirect:'/copyright-terms#copyright-terms'},{path:'/articles/:id',alias:'/article/:id',name:'article',component:ArticleDetailView,meta:{title:'Article | IJICS'}},{path:'/article-detail.html',redirect:'/articles/376'},{path:'/issues/:id',component:ArchiveView,meta:{title:'All Issues | IJICS'}},{path:'/all-issues/article/:id',redirect:to=>'/issues/'+to.params.id},{path:'/:pathMatch(.*)*',name:'not-found',component:NotFoundView,meta:{title:'Page not found | IJICS'}});
 const router=createRouter({history:ssr?createMemoryHistory(import.meta.env.BASE_URL):createWebHistory(import.meta.env.BASE_URL),routes,scrollBehavior(to,from,saved){if(saved)return saved;if(to.hash)return {el:to.hash,top:140};return {top:0}}});
 if(!ssr)router.afterEach(to=>{if(to.name!=='article'){updateArticleMeta(null);document.querySelectorAll('script[type="application/ld+json"]').forEach(el=>el.remove());}if(to.name!=='article')document.title=to.meta.title||'IJICS';const meta=document.querySelector('meta[name="description"]');if(meta&&to.name!=='article')meta.content=to.meta.description||'';if(to.name!=='article'){const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=(import.meta.env.VITE_SITE_URL||'https://www.ijics.cn').replace(/\/$/,'')+(import.meta.env.BASE_URL||'/').replace(/\/$/,'')+to.path;}document.querySelectorAll('.site-header details[open]').forEach(el=>el.removeAttribute('open'));});
 return router;
}
