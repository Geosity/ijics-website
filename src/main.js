import {createApp,createSSRApp} from 'vue';
import App from './App.vue';
import {makeRouter} from './router.js';
import './styles/legacy.css';
import './styles/home-hero.css';
import './styles/detail.css';
import './styles/migration.css';
const router=makeRouter(false);const app=document.querySelector('#app')?.children.length?createSSRApp(App):createApp(App);app.use(router);router.isReady().then(()=>app.mount('#app'));
