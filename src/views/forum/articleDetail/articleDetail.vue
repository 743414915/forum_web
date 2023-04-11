<template>
  <div
    class="container-body center articleDetail"
    :style="{ width: proxy.globalInfo.bodyWidth + '%' }"
    v-if="!utils.isObjEmpty(articleInfo)"
    ref="articleDetailRef"
  >
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">{{
        articleInfo.pBoardName
      }}</router-link>
      <span class="iconfont icon-right"></span>
      <template v-if="articleInfo.boardName">
        <router-link
          :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
          class="a-link"
          >{{ articleInfo.boardName }}</router-link
        >
        <span class="iconfont icon-right"></span>
      </template>
      <span class="title">{{ articleInfo?.title }}</span>
    </div>
    <div class="detail-container">
      <div class="artcile-detail">
        <!-- 标题 -->
        <div class="title">{{ articleInfo.title }}</div>
        <!-- 用户信息 -->
        <div class="user-info">
          <avatar :userId="articleInfo.userId" :width="50"></avatar>
          <div class="user-info-detail">
            <router-link
              :to="`/user/${articleInfo.userId}`"
              class="nick-name a-link"
              >{{ articleInfo.nickName }}</router-link
            >
            <div class="time-info">
              <span class="post-time">{{ articleInfo.postTime }}</span>
              <span class="address"
                >&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span
              >
              <span class="iconfont icon-eye-solid read-count">
                {{
                  articleInfo.readCount == 0 ? "阅读" : articleInfo.readCount
                }}
              </span>
            </div>
          </div>
        </div>
        <!-- 文章详情 -->
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>
      <!-- 附件 -->
      <div class="attachment-panel" id="view-attachment" v-if="attachment">
        <div class="attachment-title">附件</div>
        <div class="attachment-info">
          <div class="iconfont icon-zip"></div>
          <div class="file-name">{{ attachment.fileName }}</div>
          <div class="size">
            {{ utils.formatFileSize(attachment.fileSize) }}
          </div>
          <div class="integral">
            需要<span>{{ attachment.integral }}</span
            >积分
          </div>
          <div class="download-count">
            已下载<span>{{ attachment.downloadCount }}</span
            >次
          </div>
          <div class="download-btn">
            <el-button
              class="btn"
              color="rgb(255,182,193)"
              type="primary"
              size="small"
              @click="downloadTheAttachment(attachment.fileId)"
              >下载</el-button
            >
          </div>
        </div>
      </div>
      <!-- 评论 -->
      <div class="comment-panel" id="view-comment"></div>
    </div>
  </div>
  <!-- 左侧快捷操作 -->
  <div
    class="quick-panel"
    ref="quickPanelRef"
    :style="{ left: quickPanelLeft + 'px' }"
  >
    <el-badge
      v-for="(item, index) in badgeDescription"
      :key="item + index"
      :value="articleInfo[item.key]"
      type="info"
      :hidden="!articleInfo[item.key]"
    >
      <div class="quick-item" @click="badgeClick(item.key)">
        <span
          :class="[
            'iconfont',
            item.icon,
            isLikeClick(item.key) ? 'have-like' : '',
          ]"
        >
        </span></div
    ></el-badge>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

import utils from "@/utils/utils";
import badgeDescription from "./description";

const api = {
  getArticleDetail: "/forum/getArticleDetail",
  doLike: "forum/doLike",
  getUserDownloadInfo: "forum/getUserDownloadInfo",
  attachmentDownload: "/api/forum/attachmentDownload",
};

// 文章详情
const articleInfo = ref({});
// 附件
const attachment = ref({});

//获取用户积分
const getUserIntegral = (fileId) => {
  return proxy.request({
    url: api.getUserDownloadInfo,
    params: { fileId },
  });
};
// 下载附件
const downloadTheAttachment = (fileId) => {
  const loginUserInfo = store.getters.getLoginUserInfo;
  if (!loginUserInfo) {
    store.dispatch("showLogin", true);
    return;
  }
  // 当前附件下载不需要积分
  if (
    attachment.value.integral == 0 ||
    loginUserInfo.userId == articleInfo.userId
  ) {
    document.location.href = api.attachmentDownload + `?fileId=${fileId}`;
    getArticleDetail(route.params.articleId);
    return;
  }
  getUserIntegral(fileId).then((res) => {
    if (!res || res.code !== 200) {
      return;
    }
    // 判断用户积分是否满足附件下载积分
    if (
      res.data.userIntegral < attachment.value.integral &&
      !res.data.haveDownload
    ) {
      proxy.message.warning(
        `您的积分不足,无法下载！您的当前积分为：${res.data.userIntegral}`
      );
      return;
    }
    proxy.confirm(
      `您的当前积分为${res.data.userIntegral},当前下载会消耗${attachment.value.integral}积分,确定下载吗?`,
      () => {
        document.location.href = api.attachmentDownload + `?fileId=${fileId}`;
        getArticleDetail(route.params.articleId);
      }
    );
  });
};

// 是否已点赞
const haveLike = ref(false);
const isLikeClick = (key) => {
  if (key === "goodCount" && haveLike.value) {
    return true;
  }
  return false;
};
const getArticleDetail = (articleId) => {
  proxy
    .request({
      url: api.getArticleDetail,
      params: {
        articleId,
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      articleInfo.value = res.data.forumArticleVO;
      attachment.value = res.data.attachmentVO;
      haveLike.value = res.data.haveLike;
    });
};

const articleDetailRef = ref();
const quickPanelRef = ref();
// 快捷操作
const quickPanelLeft = computed(() => {
  let left = 0;
  let $articleDetailRef = $(articleDetailRef.value),
    $quickPanelRef = $(quickPanelRef.value);
  if (articleDetailRef.value && quickPanelRef.value) {
    left = $articleDetailRef.offset().left - $quickPanelRef.width() - 50;
  }
  return left;
});

// 点赞
const doLikeHandler = () => {
  if (!store.getters.getLoginUserInfo) {
    store.dispatch("showLogin", true);
    return;
  }
  proxy
    .request({
      url: api.doLike,
      params: {
        articleId: articleInfo.value.articleId,
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      haveLike.value = !haveLike.value;
      getArticleDetail(route.params.articleId);
    });
};

const goToPosition = (domId) => {
  let $quickPanelRef = $(quickPanelRef.value);
  $("html,body").animate(
    {
      scrollTop:
        $quickPanelRef.offset().top - document.documentElement.scrollTop,
    },
    100
  );
};
// 点击徽章
const badgeClick = (badgeKey) => {
  switch (badgeKey) {
    case "goodCount":
      doLikeHandler();
      break;
    case "commentCount":
    case "attachment":
      goToPosition("view-attachment");
      break;

    default:
      break;
  }
};
onMounted(() => {
  getArticleDetail(route.params.articleId);
});
</script>
<style lang="less" scoped>
.articleDetail {
  height: 2000px;
  .board-info {
    padding: 10px 0;
    .icon-right {
      color: #fbb9df;
      margin: 0 10px;
    }
    .title {
      font-weight: 800;
      color: #fbb9df;
    }
  }
  .detail-container {
    width: 100%;
    .artcile-detail {
      background: #fff;
      padding: 10px;
      .title {
        font-weight: bold;
      }
      .user-info {
        display: flex;
        margin-top: 15px;
        padding-bottom: 10px;
        border-bottom: 3px solid rgba(251, 185, 223, 0.2);
        .user-info-detail {
          margin-left: 10px;
          .nick-name {
            font-size: 15px;
          }
          .time-info {
            margin-top: 5px;
            span {
              font-size: 13px;
              color: #bbb;
            }
            .read-count {
              margin-left: 10px;
              &::before {
                padding-right: 5px;
              }
            }
          }
        }
      }
      .detail {
        padding-top: 15px;
        letter-spacing: 1px;
        line-height: 22px;
        a {
          text-decoration: none;
          color: #fbb9df;
          &:hover {
            color: #d56cdf;
          }
        }
        img {
          max-width: 90%;
          cursor: pointer;
        }
      }
    }
    .attachment-panel {
      background: #fff;
      margin-top: 15px;
      padding: 20px;
      .attachment-title {
        font-size: 18px;
      }
      .attachment-info {
        display: flex;
        align-items: center;
        color: #bbb;
        margin-top: 15px;
        > div {
          margin-right: 10px;
        }
        .icon-zip {
          font-size: 20px;
          color: rgb(251, 185, 223);
        }
        .file-name {
          color: #d56cdf;
        }
        .integral {
          span {
            color: red;
            padding: 0 5px;
          }
        }
        .download-btn {
          .btn {
            color: #fff;
          }
        }
      }
    }
    .comment-panel {
      margin-top: 15px;
      background: #fff;
    }
  }
}

.quick-panel {
  text-align: center;
  position: fixed;
  top: 180px;
  width: 50px;
  .quick-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fbb9df;
    margin-bottom: 30px;
    cursor: pointer;
    .iconfont {
      font-size: 22px;
      color: #fff;
      &.have-like {
        color: red;
      }
    }
  }
  ::v-deep(.el-badge__content.is-fixed) {
    top: 5px;
    right: 15px;
  }
}
</style>