import {createSSRApp} from 'vue';
import {renderToString} from '@vue/server-renderer';
import App from './App.vue';
import {makeRouter} from './router.js';
export async function render(url){const router=makeRouter(true);await router.push(url);await router.isReady();const app=createSSRApp(App);app.use(router);return {html:await renderToString(app),route:router.currentRoute.value};}
