<template>
  <div
    class="container-body center"
    :style="{ width: proxy.globalInfo.bodyWidth + '%' }"
  >
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
            <articleListItem :data="data"></articleListItem>
          </template>
        </dataList>
      </div>
    </div>
  </div>
</template>
<script setup>
import articleListItem from "./components/articleListItem.vue";

import { ref, reactive, getCurrentInstance, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  loadArticle: "/forum/loadArticle",
};

const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    boardId: 0,
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

onMounted(() => {
  loadArticle();
});
</script>
<style lang="less" scoped>
.container-body {
  margin-top: 65px;
  background: #fff;
  .article-panel {
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