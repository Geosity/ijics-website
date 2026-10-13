import fs from 'node:fs/promises';
import {normalizeArticle} from '../src/api/articleAdapter.js';
const file='src/data/articles.json';
const previous=JSON.parse(await fs.readFile(file,'utf8'));
const asOf=new Date().toISOString();const records=[],failures=[];
for(let start=0;start<previous.length;start+=4){const batch=await Promise.all(previous.slice(start,start+4).map(async old=>{try{const res=await fetch(`https://www.ijics.cn/api/ijics/article/detail/${old.id}`,{signal:AbortSignal.timeout(20000)});if(!res.ok)throw new Error('HTTP '+res.status);const record=normalizeArticle(await res.json(),{asOf});if(!record.title||Number(record.id)!==Number(old.id))throw new Error('invalid article');return {...record,figure:record.figure||old.figure,figureCaption:record.figureCaption||old.figureCaption};}catch(error){failures.push({id:old.id,error:error.message});return old;}}));records.push(...batch);}
if(failures.length){console.error(JSON.stringify({updated:previous.length-failures.length,failures}));process.exitCode=1;}else{await fs.writeFile(file+'.tmp',JSON.stringify(records,null,2)+'\n');await fs.rename(file+'.tmp',file);console.log(`Refreshed ${records.length} public articles as of ${asOf}`);}
