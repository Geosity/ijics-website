import fs from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';
import articles from '../src/data/articles.json' with {type:'json'};
import pages from '../src/data/pages.json' with {type:'json'};
import issues from '../src/data/issues.json' with {type:'json'};
const template=await fs.readFile('dist/index.html','utf8');
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function metadata(route,article){
 const base=(process.env.IJICS_BASE_PATH||'/').replace(/\/$/,'');const site=(process.env.IJICS_SITE_URL||'https://www.ijics.cn').replace(/\/$/,'');
 const canonical=site+base+route;
 let html=`<link rel="canonical" href="${esc(canonical)}">`;
 if(article){
  const [first,last]=article.pages.split('–');
  const meta={citation_title:article.title,citation_journal_title:'The International Journal of Intelligent Control and Systems',citation_publication_date:article.published?.replaceAll('-','/'),citation_volume:article.volume,citation_issue:article.issue,citation_firstpage:first,citation_lastpage:last,citation_doi:article.doi,citation_issn:'0218-7965',citation_pdf_url:article.browseUrl};
  for(const [name,value] of Object.entries(meta))if(value!==null&&value!==undefined&&value!=='')html+=`<meta name="${name}" content="${esc(value)}">`;
  for(const name of article.authors)html+=`<meta name="citation_author" content="${esc(name)}">`;
  const json={ '@context':'https://schema.org','@type':'ScholarlyArticle',headline:article.title,author:article.authors.map(name=>({'@type':/Editorial Office|Editorial Board|Consortium|Committee|Working Group/i.test(name)?'Organization':'Person',name})),datePublished:article.published,identifier:article.doi,url:canonical,isPartOf:{'@type':'Periodical',name:meta.citation_journal_title,issn:'0218-7965'}};
  html+=`<script type="application/ld+json">${JSON.stringify(json).replaceAll('<','\\u003c')}</script>`;
 }
 return html;
}
const targets=new Map();
for(const p of pages){if(p.file==='article-detail.html'){targets.set('/article-detail.html',{route:'/articles/376',canonical:'/articles/376',article:articles.find(a=>a.id===376)});continue;}targets.set(p.path,{route:p.path,title:p.title,description:p.description});targets.set('/'+p.file,{route:p.path,canonical:p.path,title:p.title,description:p.description});}
for(const article of articles){for(const prefix of ['articles','article'])targets.set(`/${prefix}/${article.id}`,{route:`/articles/${article.id}`,canonical:`/articles/${article.id}`,article,title:article.title+' | IJICS',description:article.abstract?.slice(0,200)});}
for(const issue of issues){targets.set('/issues/'+issue.id,{route:'/issues/'+issue.id,title:issue.title+' | IJICS'});targets.set('/all-issues/article/'+issue.id,{route:'/issues/'+issue.id,canonical:'/issues/'+issue.id,title:issue.title+' | IJICS'});}
targets.set('/404.html',{route:'/not-found',title:'Page not found | IJICS'});
try{
 const {render}=await vite.ssrLoadModule('/src/entry-server.js');
 for(const [url,data] of targets){
  const {html}=await render(data.route);
  let output=template.replace('<!--app-html-->',html).replace('<!--page-meta-->',metadata(data.canonical||data.route,data.article)).replace(/<title>.*?<\/title>/,`<title>${esc(data.title||'IJICS')}</title>`).replace(/(<meta name="description" content=")[^"]*/,(_,p)=>p+esc(data.description||'The International Journal of Intelligent Control and Systems'));
  const destination=url==='/'?'dist/index.html':url.endsWith('.html')?'dist'+url:'dist'+url+'/index.html';
  await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,output);
 }
 await fs.writeFile('dist/routes.json',JSON.stringify([...targets.keys()],null,2));
 await fs.writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...targets].filter(([p,v])=>!p.endsWith('.html')&&(!v.canonical||v.canonical===p)).map(([p])=>`<url><loc>${esc((process.env.IJICS_SITE_URL||'https://www.ijics.cn')+(process.env.IJICS_BASE_PATH||'/').replace(/\/$/,'')+p)}</loc></url>`).join('')+'</urlset>');
 console.log(`Prerendered ${targets.size} routes (${articles.length} articles, ${pages.length} original pages).`);
}finally{await vite.close();}
