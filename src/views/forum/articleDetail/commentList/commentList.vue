<template>
  <div class="comment-list">
    <div class="comment-body">
      <div class="comment-title">
        <div class="title">
          <span>评论</span>
          <span class="count">{{ commentListInfo.totalCount }}</span>
        </div>
        <div class="tab">
          <span
            @click="orderChange(0)"
            :class="['tabitem', orderType == 0 ? 'active' : '']"
            >热榜</span
          >
          <el-divider direction="vertical"></el-divider>
          <span
            @click="orderChange(1)"
            :class="['tabitem', orderType == 1 ? 'active' : '']"
            >最新</span
          >
        </div>
      </div>
      <!-- 发送评论 -->
      <div class="comment-form-panel">
        <commentPost
          :articleId="articleId"
          :avatarWidth="50"
          :userId="currentUserInfo.userId"
          :isShowInsertImage="isShowInsertImage"
          :placeholder="placeholder"
          @afterPostComment="afterPostComment"
        ></commentPost>
      </div>
    </div>
    <div class="comment-list">
      <dataList
        :dataSource="commentListInfo"
        :loading="loading"
        @loadData="loadComment"
      >
        <template #default="{ data }">
          <commentListItem
            :articleId="articleId"
            :articleUserId="articleUserId"
            :commentData="data"
            :currentUserId="currentUserInfo.userId"
            @hiddenAllReply="hiddenAllReplyHandler"
            @afterPostComment="afterPostComment"
            @hiddenAllReplyHandler="hiddenAllReplyHandler"
            @reloadData="loadComment"
          ></commentListItem>
        </template>
      </dataList>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, watch, computed } from "vue";
const { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const store = useStore();

import commentListItem from "../commentListItem/commentListItem.vue";
import commentPost from "../commentPost/commentPost.vue";

const props = defineProps({
  articleId: {
    type: String,
    default: "",
  },
  articleUserId: {
    type: String,
    default: "",
  },
});
const placeholder = "请荔枝发言，做一个合格的二次元";
const api = {
  loadComment: "/comment/loadComment",
};

const isShowInsertImage = computed(() => {
  return currentUserInfo.value.userId !== null;
});

// 排序
const orderType = ref(0);
const orderChange = (type) => {
  orderType.value = type;
  loadComment();
};

// 评论列表
const loading = ref(null);
const commentListInfo = ref({});
const loadComment = () => {
  let params = {
    pageNo: commentListInfo.value.PageNo,
    articleId: props.articleId,
    orderType: orderType.value,
  };
  loading.value = true;
  proxy
    .request({
      url: api.loadComment,
      params,
      showLoading: false,
    })
    .then((res) => {
      loading.value = false;
      if (!res || res.code !== 200) {
        return;
      }
      commentListInfo.value = res.data;
    });
};

// 当前用户
const currentUserInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

loadComment();

// 隐藏所有回复框
const hiddenAllReplyHandler = () => {
  commentListInfo.value.list &&
    commentListInfo.value.list.forEach((element) => {
      element.showReply = false;
    });
};

// 评论发布完成
const emit = defineEmits(["updateCommentCount"]);
const afterPostComment = (data, isSecCom = false) => {
  if (isSecCom) {
    loadComment();
  } else {
    commentListInfo.value.list.unshift(data);
  }
  hiddenAllReplyHandler();
  emit("updateCommentCount");
};
</script>
<style lang="less" scoped>
.comment-list {
  .comment-body {
    .comment-title {
      display: flex;
      align-items: center;
      .title {
        font-size: 20px;
        .count {
          padding: 0 10px;
          font-size: 14px;
        }
      }
      .tab {
        .tabitem {
          cursor: pointer;
        }
        .active {
          color: #f69;
        }
      }
    }
    .comment-form-panel {
      padding-top: 20px;
    }
  }
}
</style>