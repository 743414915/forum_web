<template>
  <div class="layout">
    <div class="header" v-show="showHeader">
      <div
        class="header-content center"
        :style="{ width: proxy.globalInfo.bodyWidth + '%' }"
      >
        <!-- logo -->
        <router-link to="/" class="logo">
          <span
            v-for="(item, index) in logoInfo"
            :style="{ color: item.color }"
            :key="item + index"
            >{{ item.letter }}</span
          >
        </router-link>
        <!-- 板块信息部分 -->
        <div class="menu-panel">
          <plateInformation :boardList="boardList"></plateInformation>
        </div>
        <!-- 登陆注册用户信息部分 -->
        <div class="user-info-panel">
          <el-button type="primary" color="rgb(255,182,193)" class="op-btn">
            <span>发帖</span>
            <span class="iconfont icon-add"></span>
          </el-button>
          <el-button type="primary" color="rgb(255,182,193)" class="op-btn">
            <span>搜索</span>
            <span class="iconfont icon-search"></span>
          </el-button>

          <!-- 显示用户信息 -->
          <template v-if="userInfo.userId">
            <div class="message-info">
              <userInfoDropdown :dropdowns="messageDrowdowns">
                <el-badge :value="12" class="item">
                  <div class="iconfont icon-message"></div>
                </el-badge>
              </userInfoDropdown>
            </div>
            <div class="user-info">
              <userInfoDropdown
                :dropdowns="avatarDrowdowns"
                @handleCommand="avatarHandleCommand"
              >
                <Avatar :userId="userInfo.userId" :width="50"></Avatar>
              </userInfoDropdown>
            </div>
          </template>
          <!-- 登陆注册按钮组 -->
          <el-button-group style="margin-left: 10px" v-else>
            <el-button
              type="primary"
              color="rgb(251, 185, 223)"
              plain
              @click="loginAndRegister(1)"
              >登录</el-button
            >
            <el-button
              type="primary"
              color="rgb(251, 185, 223)"
              plain
              @click="loginAndRegister(0)"
              >注册</el-button
            >
          </el-button-group>
        </div>
      </div>
    </div>
    <Dialog :isShow="false">
      <div style="height: 1500px"></div>
    </Dialog>
    <div class="body-content">
      <router-view ref="sss"></router-view>
    </div>
    <!-- 登录、注册 -->
    <LoginAndRegister ref="loginAndRegisterRef"></LoginAndRegister>
  </div>
</template>

<script setup>
import LoginAndRegister from "@/views/LoginAndRegister/LoginAndRegister.vue";
import plateInformation from "@/views/plateInformation/plateInformation.vue";
import userInfoDropdown from "@/views/LoginAndRegister/components/userInfoDropdown/userInfoDropdown.vue";

import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import utils from "@/utils/utils.js";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  getUserInfo: "/account/getUserInfo",
  loadBoard: "/board/loadBoard",
  logout: "/account/logout",
};

// 铃铛下拉列表
const messageDrowdowns = reactive([
  { key: "replyToMe", message: "回复我的" },
  { key: "likedTheArticle", message: "赞了我的文章" },
  { key: "downloadTheAttachment", message: "下载了我的附件" },
  { key: "likedTheComment", message: "赞了我的评论" },
  { key: "systemMessages", message: "系统消息" },
]);

//头像下拉列表
const avatarDrowdowns = reactive([
  { key: "myPage", message: "我的主页" },
  { key: "quit", message: "退出" },
]);
// 退出登录
const loginOut = () => {
  proxy
    .request({
      url: api.logout,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      proxy.message.success("退出成功！");
      location.reload();
    })
    .catch((error) => {
      proxy.message.error("退出失败，请重试！");
    });
};
// 点击头像下拉列表菜单项
const avatarHandleCommand = (command) => {
  switch (command) {
    case "quit":
      loginOut();
      break;

    default:
      break;
  }
};

// =========================data=========================
let initScrollTop = ref(0);
let showHeader = ref(true);

const logoInfo = ref([
  {
    letter: "F",
    color: utils.getRandomColor(),
  },
  {
    letter: "o",
    color: utils.getRandomColor(),
  },
  {
    letter: "r",
    color: utils.getRandomColor(),
  },
  {
    letter: "u",
    color: utils.getRandomColor(),
  },
  {
    letter: "m",
    color: utils.getRandomColor(),
  },
]);

// ========================methods======================
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};

const scrolls = () => {
  let scrollType = 0;
  let currentScrollTop = getScrollTop();
  if (currentScrollTop > initScrollTop) {
    // 网下滚动
    scrollType = 1;
  } else {
    // 往上滚动
    scrollType = 0;
  }
  initScrollTop = currentScrollTop;
  if (scrollType === 1 && currentScrollTop > 300) {
    showHeader.value = false;
  } else {
    showHeader.value = true;
  }
};

const initScroll = () => {
  initScrollTop = getScrollTop();
  window.addEventListener("scroll", scrolls, true);
};

// 获取板块信息
const boardList = ref([]);
const loadBoard = () => {
  proxy
    .request({
      url: api.loadBoard,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      boardList.value = res.data;
      store.dispatch("saveBoardList", res.data);
    });
};

// 登录注册
const loginAndRegisterRef = ref();
const loginAndRegister = (type) => {
  loginAndRegisterRef.value.isShowPanel(type);
};

//获取用户信息
const getUserInfo = () => {
  proxy
    .request({
      url: api.getUserInfo,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      store.dispatch("updateLoginUserInfo", res.data);
    });
};

// 监听 登录用户信息
const userInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal !== undefined && newVal !== null) {
      userInfo.value = newVal;
    } else {
      userInfo.value = {};
    }
  },
  { immediate: true, deep: true }
);
// 监听是否展示登录窗
watch(
  () => store.state.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      loginAndRegister(1);
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  initScroll();
  getUserInfo();
  loadBoard();
});

onUnmounted(() => {
  window.removeEventListener("scroll", scrolls, true);
});
</script>

<style lang="less" scoped>
.layout {
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    box-shadow: 0 2px 6px 0 rgb(255, 162, 173);
    z-index: 1000;
    // background-color: rgba(251, 185, 223, 0.3);
    background-color: rgb(251, 225, 240);
    .header-content {
      display: flex;
      align-items: center;
      height: 60px;
      line-height: 60px;
      .logo {
        display: block;
        margin-right: 5px;
        font-size: 30px;
        text-decoration: none;
      }
      .menu-panel {
        flex: 1;
      }
      .user-info-panel {
        width: 300px;
        display: flex;
        align-items: center;
        .message-info {
          cursor: pointer;
          display: flex;
          height: 100%;
          line-height: 100%;
          .icon-message {
            padding-left: 10px;
            font-size: 20px;
            color: rgb(147, 147, 147);
          }
        }
        .user-info {
          cursor: pointer;
          padding-left: 20px;
          ::v-deep(.el-image__error) {
            font-size: 12px;
          }
        }

        .op-btn {
          color: #fff;
          &:not(:first-child) {
            margin-left: 5px;
          }
          .iconfont {
            margin-left: 5px;
          }
        }
      }
    }
  }
  .body-content {
    margin-top: 60px;
    position: relative;
  }
}
</style>