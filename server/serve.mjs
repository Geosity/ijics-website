import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve('dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.xml':'application/xml'};
export function createPreviewServer({apiTarget=process.env.IJICS_TEST_API_URL||'http://127.0.0.1:4181',base=process.env.IJICS_BASE_PATH||'/'}={}){
 return http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://localhost');let pathname=decodeURIComponent(url.pathname);
   const prefix=base.replace(/\/$/,'');if(prefix && !pathname.startsWith(prefix+'/')&&pathname!==prefix){res.writeHead(404);return res.end('Not found');}if(prefix)pathname=pathname.slice(prefix.length)||'/';
   if(pathname.startsWith('/api/')){if(req.method!=='GET'){res.writeHead(405,{'Allow':'GET'});return res.end();}try{const upstream=await fetch(apiTarget+pathname+url.search,{signal:AbortSignal.timeout(15000)});res.writeHead(upstream.status,{'Content-Type':upstream.headers.get('content-type')||'application/json'});return res.end(Buffer.from(await upstream.arrayBuffer()));}catch{res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'API unavailable'}));}}
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
   let target=path.resolve(root,'.'+pathname);if(!target.startsWith(root+path.sep)&&target!==root){res.writeHead(403);return res.end();}
   try{const stat=await fs.stat(target);if(stat.isDirectory())target=path.join(target,'index.html');const data=await fs.readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);}catch{const data=await fs.readFile(path.join(root,'404.html'));res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(req.method==='HEAD'?undefined:data);}
  }catch{res.writeHead(400);res.end('Invalid request');}
 });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const server=createPreviewServer();server.listen(Number(process.env.PORT||4175),'127.0.0.1',()=>console.log('IJICS Vue preview http://127.0.0.1:'+(process.env.PORT||4175)));}
