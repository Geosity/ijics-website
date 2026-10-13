import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import articles from '../src/data/articles.json' with {type:'json'};
import pages from '../src/data/pages.json' with {type:'json'};
import {createPreviewServer} from '../server/serve.mjs';
const base=(process.env.IJICS_BASE_PATH||'/').replace(/\/$/,'');
let server,origin;
test.before(async()=>{server=createPreviewServer({base:process.env.IJICS_BASE_PATH||'/'});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin=`http://127.0.0.1:${server.address().port}${base}`;});
test.after(()=>new Promise(resolve=>server.close(resolve)));
test('all original pages, legacy aliases and article routes return prerendered content',async()=>{
 for(const p of pages){const url=p.file==='article-detail.html'?'/articles/376':p.path;for(const entry of [url,'/'+p.file]){const res=await fetch(origin+entry);assert.equal(res.status,200,entry);const html=await res.text();assert.match(html,/<div id="app">(?!<!--app-html-->)/,entry);assert.doesNotMatch(html,/<!--app-html-->/,entry);assert.match(html,/type="module"/);assert.match(html,/<main[ >]/,entry);}}
 for(const a of articles){const res=await fetch(origin+'/articles/'+a.id);assert.equal(res.status,200);const html=await res.text();assert.ok(html.includes(a.title.replaceAll('&','&amp;').replaceAll('"','&quot;'))||html.includes(a.title),`title ${a.id}`);assert.ok(html.includes('name="citation_doi"'),`metadata ${a.id}`);assert.ok(html.includes(a.doi),`DOI ${a.id}`);if(a.abstract)assert.ok(html.includes(a.abstract.slice(0,60).replaceAll('&','&amp;')),`abstract ${a.id}`);assert.doesNotMatch(html,/href="https:\/\/www\.ijics\.cn\/article\/\d+/);}
});
test('unknown routes and articles remain HTTP 404',async()=>{for(const url of ['/not-a-real-page','/articles/999999','/articles/not-an-id'])assert.equal((await fetch(origin+url)).status,404,url);});
test('snapshot coverage and sensitive-field whitelist',async()=>{assert.equal(articles.length,36);assert.equal(new Set(articles.map(a=>a.id)).size,36);for(const a of articles){assert.ok(a.title);assert.match(a.source,/^https:\/\/www\.ijics\.cn\/api\/ijics\/article\/detail\/\d+$/);assert.ok(Number.isFinite(Date.parse(a.metricsAsOf)),`dated metric ${a.id}`);assert.doesNotMatch(JSON.stringify(a),/"(?:email|createdUserID|updatedUserID|manuscriptID|pdfLink)"/);}});
test('served Vue bundle replaces legacy DOM script and contains no prototype runtime',async()=>{const html=await fs.readFile('dist/index.html','utf8');assert.doesNotMatch(html,/script\.js\?v|vue\.esm-browser\.prod|article-design\/app/);assert.match(html,/assets\//);assert.match(html,/href="\/[^"]*(?:articles|issues)\//);});
