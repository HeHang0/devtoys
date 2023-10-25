import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';

import App from './App.vue';
import router from './router';
import { useRegisterSW } from 'virtual:pwa-register/vue';

import './assets/main.css';
import './assets/hljs.less';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
useRegisterSW();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
