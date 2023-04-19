<template>
  <div
    class="container-body search"
    :style="{ width: proxy.globalInfo.bodyWidth + '%' }"
  >
    <div class="search-panel">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
      >
        <!--input输入-->
        <el-form-item prop="keyword">
          <el-input
            size="large"
            clearable
            placeholder="请输入你想要查找的关键词"
            v-model.trim="formData.keyword"
            @focus="startSearchHandler"
            @clear="clearFormData"
          >
            <template #suffix>
              <span
                class="iconfont icon-search"
                @click.stop="search"
                @blur="formData.keyword = $event.target.value.trim()"
              ></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-list">
      <dataList
        :loading="loading"
        :dataSource="articleListInfo"
        @loadData="search"
      >
        <template #default="{ data }">
          <articleListItem
            :showComment="showComment"
            :data="data"
            :htmlTitle="true"
          ></articleListItem>
        </template>
      </dataList>
    </div>
  </div>
</template>
<script setup>
import articleListItem from "@/views/forum/components/articleListItem.vue";

import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const store = useStore();

const api = {
  loadArticle: "/forum/search",
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  keyword: [{ required: true, message: "请输入关键字" }],
};

// 评论列表
const loading = ref(null);
const articleListInfo = ref({});
const search = () => {
  let params = {
    pageNo: articleListInfo.value.PageNo,
    keyword: formData.value.keyword,
  };
  loading.value = true;
  proxy
    .request({
      url: api.loadArticle,
      params,
      showLoading: false,
    })
    .then((res) => {
      loading.value = false;
      if (!res || res.code !== 200) {
        return;
      }
      articleListInfo.value = res.data;
      let list = res.data.list;
      list.forEach((element) => {
        element.title = element.title.replace(
          params.keyword,
          `<span style='color: red;'>${params.keyword}</span>`
        );
      });
    });
};
// 清空输入框
const clearFormData = () => {
  articleListInfo.value = {};
};

watch(
  () => formData.value.keyword,
  (newVal, oldVal) => {
    if (formData.value.keyword === "") {
      articleListInfo.value = {};
    }
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
.search {
  background: #fff;
  padding: 10px;
  margin: 0 auto;
  min-height: calc(100vh - 210px);
  .search-panel {
    display: flex;
    justify-content: center;
    .icon-search {
      cursor: pointer;
    }
    ::v-deep(.el-input) {
      width: 700px;
      .el-input__wrapper {
        &.is-focus {
          box-shadow: 0 0 0 1px rgb(251, 185, 223);
        }
      }
    }
  }
}
</style>