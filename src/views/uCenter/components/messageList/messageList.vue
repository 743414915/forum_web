<template>
  <div
    class="container-body center message-list"
    :style="{ width: proxy.globalInfo.bodyWidth + '%' }"
    ref="messageListRef"
  >
    <div class="user-banner">
      <router-link to="/" class="a-link">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>首页消息中心</span>
    </div>
    <div class="message-panel">
      <div class="tab-list">
        <el-tabs :model-value="activeTabName" @tab-change="tabChange">
          <el-tab-pane
            :label="item.message"
            :name="item.key"
            v-for="(item, index) in messageDropdowns"
            :key="item + index"
          >
            <template #label>
              <div class="tab-item">
                <span>{{ item.message }}</span>
                <span class="count-tag" v-if="messageCountInfo[item.key]">{{
                  messageCountInfo[item.key] > 99
                    ? "99+"
                    : messageCountInfo[item.key]
                }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <router-link class="a-link go-ucenter" :to="`/user/${userId}`"
          >&lt;&lt;个人中心</router-link
        >
      </div>
      <div class="message-list">
        <dataList
          :loading="loading"
          :dataSource="messageListInfo"
          @loadData="loadMessage"
          noDataMsg="暂无消息"
        >
          <template #default="{ data }">
            <!-- 系统消息 -->
            <div class="message-item" v-if="data.messageType == 0">
              <div class="message-content">
                <span v-html="data.messageContent"></span>
                <span class="create-time">{{ data.createTime }}</span>
              </div>
            </div>
            <!-- 回复我的 -->
            <div class="message-item" v-if="data.messageType == 1">
              <avatar :userId="data.sendUserId" :width="50"></avatar>
              <div class="message-content">
                <div class="nick-name">
                  <router-link class="a-lin" :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >
                  对我的文章【<router-link
                    class="a-lin"
                    :to="`/post/${data.articleId}`"
                    >{{ data.articleTitle }}</router-link
                  >】发表了评论
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
                <div class="reply-content" v-html="data.messageContent"></div>
              </div>
            </div>
            <!-- 赞了我的评论 -->
            <div class="message-item" v-if="data.messageType == 3">
              <avatar :userId="data.sendUserId" :width="50"></avatar>
              <div class="message-content">
                <div class="nick-name">
                  <router-link class="a-lin" :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >
                  在文章【<router-link
                    class="a-lin"
                    :to="`/post/${data.articleId}`"
                    >{{ data.articleTitle }}</router-link
                  >】中赞了我的评论
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
                <div class="reply-content" v-html="data.messageContent"></div>
              </div>
            </div>
            <!-- 赞了我的文章 -->
            <div class="message-item" v-if="data.messageType == 2">
              <avatar :userId="data.sendUserId" :width="50"></avatar>
              <div class="message-content">
                <div class="nick-name">
                  <router-link class="a-lin" :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >
                  赞了我的文章【<router-link
                    class="a-lin"
                    :to="`/post/${data.articleId}`"
                    >{{ data.articleTitle }}</router-link
                  >】
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
              </div>
            </div>
            <!-- 下载了我的附件 -->
            <div class="message-item" v-if="data.messageType == 4">
              <avatar :userId="data.sendUserId" :width="50"></avatar>
              <div class="message-content">
                <div class="nick-name">
                  <router-link class="a-lin" :to="`/user/${data.sendUserId}`"
                    >@{{ data.sendNickName }}</router-link
                  >
                  在文章【<router-link
                    class="a-lin"
                    :to="`/post/${data.articleId}`"
                    >{{ data.articleTitle }}</router-link
                  >】中下载了我的附件
                  <span class="create-time">{{ data.createTime }}</span>
                </div>
              </div>
            </div>
          </template>
        </dataList>
      </div>
    </div>
  </div>
</template>
<script setup>
import description from "@/views/description.js";

import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  loadMessageList: "/ucenter/loadMessageList",
};

const messageDropdowns = reactive(description.messageDropdowns);

const activeTabName = ref("reply");
const messageCountInfo = ref({});
const tabChange = (type) => {
  router.push(`/user/message/${type}`);
};

// 消息数量
const loading = ref(false);
const messageListInfo = ref({});
const loadMessage = () => {
  loading.value = true;
  let params = {
    pageNo: messageListInfo.value.pageNo,
    code: activeTabName.value,
  };
  proxy
    .request({
      url: api.loadMessageList,
      params,
      showLoading: false,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      messageListInfo.value = res.data;
      store.dispatch("readMessage", activeTabName.value);
      loading.value = false;
    });
};

watch(
  () => route.params.type,
  (newVal, oldVal) => {
    if (newVal) {
      activeTabName.value = newVal;
      loadMessage();
    }
  },
  { immediate: true, deep: true }
);

// 监听用户信息
const userId = ref(null);
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal.userId;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.message-list {
  .user-banner {
    padding: 10px 0;
    color: #fbb9df;
    .icon-right {
      padding: 0 5px;
    }
  }
  .message-panel {
    padding: 10px;
    margin-top: 5px;
    background: #fff;
    .tab-list {
      display: flex;
      justify-content: space-around;
      align-items: center;
      ::v-deep(.el-tabs__nav-wrap) {
        .el-tabs__active-bar {
          background-color: #fbb9df;
        }
        .el-tabs__item {
          &:hover {
            color: #fbb9df;
          }
          &.is-active {
            color: #fbb9df;
          }
        }
      }
      .tab-item {
        position: relative;
        padding: 0 10px;
        flex: 1;
        .count-tag {
          position: absolute;
          right: -12px;
          top: -10px;
          display: inline-block;
          min-width: 20px;
          height: 20px;
          background: #f56c6c;
          color: #fff;
          border-radius: 50%;
          font-size: 13px;
          text-align: center;
          line-height: 20px;
        }
      }
      .go-ucenter {
        font-size: 14px;
        width: 100px;
      }
    }
    .message-list {
      .message-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        border-bottom: 3px solid rgba(251, 185, 223, 0.2);
        padding: 10px;
        .message-content {
          margin-left: 5px;
          .create-time {
            color: #9ba7b9;
            margin-left: 10px;
          }
          .reply-content {
            border-left: 2px solid #11a8f4;
            padding-left: 10px;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>