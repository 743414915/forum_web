import { createApp } from 'vue'
import './assets/base.less'
import App from './App.vue'
//引入cookies
import VueCookies from 'vue-cookies'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//图标
import '@/assets/icon/iconfont.css'
// import router from 'router/index.js'

const app = createApp(App);

// app.use(router);
app.use(ElementPlus);
app.config.globalProperties.VueCookies = VueCookies;

app.mount('#app');
