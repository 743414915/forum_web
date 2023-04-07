import { createRouter, createWebHistory } from "vue-router";

import layout from '@/views/Layout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Layout",
      component: layout
    }
  ]
})

export default router;