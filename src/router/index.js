import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

import layout from '@/views/Layout.vue';
import articleList from '@/views/forum/articleList.vue';
import articleDetail from '@/views/forum/articleDetail/articleDetail.vue';
import editPost from '@/views/forum/editPost/editPost.vue';
import uCenter from '@/views/uCenter/uCenter.vue';
import messageList from '@/views/uCenter/components/messageList/messageList.vue';
import error404 from '@/views/error404/error404.vue';
import search from '@/views/search/search.vue';

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
          name: "所有文章",
          component: articleList,
        },
        {
          path: "/forum/:pBoardId",
          name: "一级板块",
          component: articleList,
        },
        {
          path: "/forum/:pBoardId/:boardId",
          name: "二级板块",
          component: articleList,
        },
        {
          path: "/post/:articleId",
          name: "文章详情",
          component: articleDetail,
        },
        {
          path: "/editPost/:articleId",
          name: "编辑帖子",
          component: editPost,
        },
        {
          path: "/newPost",
          name: "发帖",
          component: editPost,
        },
        {
          path: "/user/:userId",
          name: "用户信息",
          component: uCenter,
        },
        {
          path: "/user/message/:type",
          name: "消息中心",
          component: messageList,
        },
        {
          path: "/search",
          name: "搜索",
          component: search,
        }
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      name: "错误页",
      component: error404
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.path.indexOf('/user') !== -1) {
//     store.dispatch("setActivePBoardId", -1);
//   }
//   next();
// })
export default router;