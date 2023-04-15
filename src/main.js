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
import router from './router'

import request from './axios/request.js'
import store from './store'

// 全局组件
import Dialog from "@/components/Dialog/Dialog.vue"
import Avatar from '@/components/avatar/avatar.vue'
import cover from '@/components/cover/cover.vue'
import noData from '@/components/noData/noData.vue'
import imageViewer from '@/components/imageViewer/imageViewer.vue'
import dataList from '@/components/dataList/dataList.vue'
import confirm from '@/components/confirm/confirm.js'
import verifyObj from '@/utils/verify.js'
import message from '@/common/message.js'
const app = createApp(App);

app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.globalInfo = {
  bodyWidth: 60,
  avatarUrl: '/api/file/getAvatar/',
  imageUrl: '/api/file/getImage/'
};
app.config.globalProperties.Verify = verifyObj
app.config.globalProperties.message = message
app.config.globalProperties.request = request
app.config.globalProperties.confirm = confirm
app.use(router)
  .use(ElementPlus)
  .use(store)
  .component("Dialog", Dialog)
  .component("Avatar", Avatar)
  .component("cover", cover)
  .component("dataList", dataList)
  .component("noData", noData)
  .component("imageViewer", imageViewer);
app.mount('#app');
