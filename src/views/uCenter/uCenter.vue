<template>
  <div
    class="container-body center u-center"
    :style="{ width: proxy.globalInfo.bodyWidth + '%' }"
    ref="uCenterRef"
  >
    <div class="user-banner">
      <router-link to="/" class="a-link">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>个人中心</span>
    </div>
    <div class="u-center-panel">
      <div class="use-side">
        <!-- 头像信息 -->
        <div class="avatar-panel">
          <div
            class="edit-btn a-link"
            @click="updatedUserInfo"
            v-if="isCurrentUser"
          >
            编辑资料
          </div>
          <div class="avatar-inner">
            <avatar :userId="userInfo.userId" :width="120"></avatar>
          </div>
          <div class="nick-name">
            <span>{{ userInfo.nickName }}</span>
            <span v-if="userInfo.sex == 0" class="iconfont icon-woman"></span>
            <span v-if="userInfo.sex == 1" class="iconfont icon-man"></span>
          </div>
          <div class="desc">
            {{ userInfo.personDescription }}
          </div>
        </div>
        <!-- 扩展信息 -->
        <div class="user-extend-panel">
          <div
            class="info-item"
            v-for="(item, index) in description"
            :key="item + index"
          >
            <div :class="['label', 'iconfont', item.icon]">
              {{ item.text }}
            </div>
            <div
              :class="[
                'value',
                { 'a-link': item.key === 'currentIntegral' && isCurrentUser },
              ]"
              @click="showIntegralRecord(item.key)"
            >
              {{ userInfo[item.key] }}
            </div>
          </div>
        </div>
      </div>
      <div class="article-panel">
        <el-tabs :model-value="activeTabName" @tab-change="changeTab">
          <el-tab-pane label="发帖" :name="0"></el-tab-pane>
          <el-tab-pane label="评论" :name="1"></el-tab-pane>
          <el-tab-pane label="点赞" :name="2"></el-tab-pane>
        </el-tabs>
        <div class="article-list">
          <dataList
            :loading="loading"
            :dataSource="articleListInfo"
            @loadData="loadArticle"
          >
            <template #default="{ data }">
              <articleListItem
                :data="data"
                :showComment="showComment"
                :showEdit="activeTabName == 0 && isCurrentUser"
              ></articleListItem>
            </template>
          </dataList>
        </div>
      </div>
    </div>
    <!-- 修改用户信息 -->
    <uCenterEditUserInfo ref="uCenterEditUserInfoRef"></uCenterEditUserInfo>
    <!-- 用户积分记录 -->
    <userIntegralRecord ref="userIntegralRecordRef"></userIntegralRecord>
  </div>
</template>
<script setup>
import description from "./description.js";
import uCenterEditUserInfo from "./components/uCenterEditUserInfo/uCenterEditUserInfo.vue";
import userIntegralRecord from "./components/userIntegralRecord/userIntegralRecord.vue";
import articleListItem from "@/views/forum/components/articleListItem.vue";

import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  getUserInfo: "/ucenter/getUserInfo",
  loadUserArticle: "/ucenter/loadUserArticle",
};

const userId = ref(null);
const userInfo = ref({});
const loadUserInfo = () => {
  proxy
    .request({
      url: api.getUserInfo,
      params: {
        userId: userId.value,
      },
      errorCallback: () => {
        setTimeout(() => {
          router.push("/");
        }, 1500);
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      userInfo.value = res.data;
    });
};

const isCurrentUser = ref(false);
// 重新设置当前用户
const resetCurrentUser = () => {
  const loginUserInfo = store.getters.getLoginUserInfo;
  if (loginUserInfo && loginUserInfo.userId === userId.value) {
    isCurrentUser.value = true;
  } else {
    isCurrentUser.value = false;
  }
};

// 右侧文章
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    type: activeTabName.value,
    userId: userId.value,
  };
  proxy
    .request({
      url: api.loadUserArticle,
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

const activeTabName = ref(0);
const changeTab = (type) => {
  activeTabName.value = type;
  loadArticle();
};

watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    resetCurrentUser();
  },
  { immediate: true, deep: true }
);

watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal;
      resetCurrentUser();
      loadUserInfo();
      loadArticle();
    }
  },
  { immediate: true, deep: true }
);

// 修改个人信息
const uCenterEditUserInfoRef = ref(null);
const updatedUserInfo = () => {
  uCenterEditUserInfoRef.value.showEditUserInfoDialog(userInfo.value);
};

// 获取用户积分记录
const userIntegralRecordRef = ref(null);
const showIntegralRecord = (key) => {
  if (key != "currentIntegral" || !isCurrentUser.value) {
    return;
  }
  userIntegralRecordRef.value.showRecord();
};

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
.u-center {
  .user-banner {
    padding: 10px 0;
    color: #fbb9df;
    .icon-right {
      padding: 0 5px;
    }
  }
  .u-center-panel {
    display: flex;
    .use-side {
      width: 300px;
      margin-right: 10px;
      .avatar-panel {
        padding: 10px;
        background: #fff;
        text-align: center;
        .edit-btn {
          text-align: right;
          font-size: 14px;
        }
        .avatar-inner {
          display: flex;
          justify-content: center;
        }
        .nick-name {
          .iconfont {
            margin-right: 5px;
          }
          .icon-woman {
            color: pink;
          }
          .icon-man {
            color: rgb(9, 142, 204);
          }
        }
        .desc {
          margin-top: 5px;
          text-align: left;
          font-size: 14px;
          color: #9ba7b9;
        }
      }
      .user-extend-panel {
        margin-top: 10px;
        background: #fff;
        padding: 10px;
        .info-item {
          display: flex;
          justify-content: space-between;
          line-height: 30px;
          .label {
            font-size: 13px;
            &::before {
              padding-right: 5px;
              font-size: 22px;
              color: #fbb9df;
            }
          }
          .value {
            font-size: 13px;
          }
        }
      }
    }
    .article-panel {
      flex: 1;
      background: #fff;
      padding: 0 10px 10px 10px;
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
    }
  }
}
</style>