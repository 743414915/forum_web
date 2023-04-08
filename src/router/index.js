import { createRouter, createWebHistory } from "vue-router";

import layout from '@/views/Layout.vue';
import articleList from '@/views/forum/articleList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Layout",
      component: layout,
      children: [
        {
          path: "/",
          name: "articleList",
          component: articleList,
        }
      ]
    }
  ]
})

export default router;