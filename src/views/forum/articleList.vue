<template>
  <div
    class="container-body center"
    :style="{ width: proxy.globalInfo.bodyWidth + '%' }"
  >
    <!-- 二级板块 -->
    <div class="sub-board" v-if="pBoardId">
      <span class="board-item" v-if="subBoardList.length">
        <router-link
          :class="['a-link', isActive({ boardId }, true)]"
          :to="`/forum/${pBoardId}`"
          >全部</router-link
        >
      </span>
      <span
        class="board-item"
        v-for="(item, index) in subBoardList"
        :key="item + index"
      >
        <router-link
          :class="['a-link', isActive(item)]"
          :to="`/forum/${item.pboardId}/${item.boardId}`"
          >{{ item.boardName }}</router-link
        >
      </span>
    </div>
    <div class="article-panel">
      <div class="top-tab">
        <div :class="['tab', isTabActive(0)]" @click="changeOrderType(0)">
          热榜
        </div>
        <el-divider direction="vertical"></el-divider>
        <div :class="['tab', isTabActive(1)]" @click="changeOrderType(1)">
          发布时间
        </div>
        <el-divider direction="vertical"></el-divider>
        <div :class="['tab', isTabActive(2)]" @click="changeOrderType(2)">
          最新
        </div>
        <el-divider direction="vertical"></el-divider>
      </div>
      <div class="article-list">
        <dataList
          :loading="loading"
          :dataSource="articleListInfo"
          @loadData="loadArticle"
        >
          <template #default="{ data }">
            <articleListItem
              :showComment="showComment"
              :data="data"
            ></articleListItem>
          </template>
        </dataList>
      </div>
    </div>
  </div>
</template>
<script setup>
import articleListItem from "./components/articleListItem.vue";

import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  computed,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  loadArticle: "/forum/loadArticle",
};

const isActive = (item, isAll = false) => {
  let className = "";
  if (isAll) {
    className = boardId.value == 0 ? "active" : "";
  } else {
    className = item.boardId == boardId.value ? "active" : "";
  }
  return className;
};

//一级板块
let boardId = ref(0);
let pBoardId = ref(0);
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    boardId: boardId.value,
    pBoardId: pBoardId.value,
    orderType: orderType.value,
  };
  proxy
    .request({
      url: api.loadArticle,
      params,
      showLoading: false,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      articleListInfo.value = res.data;
      loading.value = false;
    });
};

// 热榜  发布时间  最新
let orderType = ref(0);
const isTabActive = (type) => {
  return type == orderType.value ? "active" : "";
};
const changeOrderType = (type) => {
  orderType.value = type;
  loadArticle();
};

// 二级板块
const subBoardList = ref([]);
const setSubBoard = () => {
  subBoardList.value = store.getters.getSubBoardList(pBoardId.value);
};

// 监听板块数据变化
watch(
  () => store.state.boardList,
  (newVal) => {
    setSubBoard();
  },
  { immediate: true, deep: true }
);
// 监听路由变化
watch(
  () => route.params,
  (newValue) => {
    // pBoardId.value = newValue.pBoardId ? newValue.pBoardId : 0;
    pBoardId.value = newValue.pBoardId;
    boardId.value = newValue.boardId || 0;
    loadArticle();
    setSubBoard();
    store.dispatch("setActivePBoardId", newValue.pBoardId);
    store.dispatch("setActiveBoardId", newValue.boardId);
  },
  { immediate: true, deep: true }
);

// 是否显示评论，根据系统设置
const showComment = ref(false);
watch(
  () => store.state.sysSetting,
  (newVal, oldVal) => {
    if (newVal) {
      showComment.value = newVal.commentOpen;
    }
  },
  { immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.container-body {
  .sub-board {
    padding: 10px 0px;
    .board-item {
      .a-link {
        border: 2px solid rgba(251, 185, 223, 0.5);
        box-sizing: border-box;
        background: rgba(251, 185, 223, 0.5);
        border-radius: 15px;
        padding: 2px 10px;
        margin-right: 10px;
        cursor: pointer;
        font-size: 14px;
        &.active {
          border: 2px solid rgba(251, 185, 223, 0.5);
          color: rgb(251, 185, 223);
          background: #fff;
        }
      }
    }
  }
  .article-panel {
    background: #fff;
    .top-tab {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 14px;
      border-bottom: 1px solid rgb(251, 185, 223);
      color: rgb(251, 185, 223);
      .tab {
        cursor: pointer;
      }
      .active {
        color: #d56cdf;
      }
    }
  }
}
</style>