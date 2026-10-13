import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({plugins:[vue()],base:process.env.IJICS_BASE_PATH||'/',server:{port:4174,strictPort:true,watch:{usePolling:true,interval:250},proxy:{'/api':{target:process.env.IJICS_TEST_API_URL||'http://127.0.0.1:4181',changeOrigin:true}}},build:{outDir:'dist',emptyOutDir:true}});
