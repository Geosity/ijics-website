import {createApiServer} from './api-server.mjs';
const mode=process.env.IJICS_API_MODE||'fixture',port=Number(process.env.IJICS_API_PORT||4181);
const server=createApiServer({mode});server.listen(port,'127.0.0.1',()=>console.log(`IJICS ${mode} API http://127.0.0.1:${port}/api`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
