import {spawn} from 'node:child_process';
const api=spawn(process.execPath,['server/test-api.mjs'],{stdio:'inherit',env:process.env});
const site=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4174'],{stdio:'inherit',env:{...process.env,VITE_API_BASE:'/api'}});
let stopping=false;function stop(code=0){if(stopping)return;stopping=true;api.kill('SIGTERM');site.kill('SIGTERM');setTimeout(()=>process.exit(code),100).unref();}
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>stop());api.on('exit',code=>stop(code||0));site.on('exit',code=>stop(code||0));
