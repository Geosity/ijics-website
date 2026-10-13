const journal='The International Journal of Intelligent Control and Systems';
export function updateArticleMeta(article){
 if(typeof document==='undefined')return;
 document.querySelectorAll('meta[name^="citation_"]').forEach(el=>el.remove());
 document.querySelectorAll('script[type="application/ld+json"]').forEach(el=>el.remove());
 if(!article)return;
 const [start,end]=String(article.pages||'').split('–');
 const fields={citation_title:article.title,citation_journal_title:journal,citation_issn:'0218-7965',citation_doi:article.doi,citation_publication_date:article.published?.slice(0,10).replaceAll('-','/'),citation_volume:article.volume,citation_issue:article.issue,citation_firstpage:start,citation_lastpage:end,citation_pdf_url:article.browseUrl};
 function meta(name,value){if(value===null||value===undefined||value==='')return;const node=document.createElement('meta');node.name=name;node.content=String(value);document.head.append(node);}
 for(const [name,value] of Object.entries(fields))meta(name,value);for(const author of article.authors||[])meta('citation_author',author);
 let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.append(canonical);}canonical.href=(import.meta.env.VITE_SITE_URL||'https://www.ijics.cn').replace(/\/$/,'')+(import.meta.env.BASE_URL||'/')+'articles/'+article.id;
 const schema=document.createElement('script');schema.type='application/ld+json';schema.dataset.articleSchema='';schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'ScholarlyArticle',headline:article.title,identifier:article.doi,author:article.authors.map(name=>({'@type':/Editorial Office|Editorial Board|Consortium|Committee|Working Group/i.test(name)?'Organization':'Person',name})),datePublished:article.published,url:canonical.href});document.head.append(schema);
}
