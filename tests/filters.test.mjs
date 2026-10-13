import test from 'node:test';import assert from 'node:assert/strict';
import {filterArticles,groupForArticle} from '../src/api/articleFilters.js';
import articles from '../src/data/articles.json' with {type:'json'};
test('search finds paper by DOI, author and title keyword',()=>{for(const q of ['10.62678/IJICS202606.10322','Huayang','cucumber'])assert.ok(filterArticles(articles,{q}).some(a=>a.id===322));assert.equal(filterArticles(articles,{q:'unfindable-string-999'}).length,0);});
test('type and issue filters compose without mutation',()=>{const before=JSON.stringify(articles);const result=filterArticles(articles,{type:'articles',issue:'43'});assert.ok(result.length>0);assert.ok(result.every(a=>a.issueId===43&&groupForArticle(a)==='articles'));assert.equal(JSON.stringify(articles),before);});
