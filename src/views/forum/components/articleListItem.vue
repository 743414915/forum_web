<template>
  <div class="article-list-item">
    <div class="article-list-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="data.userId" :width="50"></Avatar>
          <router-link :to="'/user/' + data.userId" class="a-link">{{
            data.nickName
          }}</router-link>
          <el-divider direction="vertical"></el-divider>
          <div class="post-time">{{ data.postTime }}</div>
          <div class="address">&nbsp;·&nbsp;{{ data.userIpAddress }}</div>
          <el-divider direction="vertical"></el-divider>
          <router-link :to="`/forum/${data.pBoardId}`" class="a-link">{{
            data.pBoardName
          }}</router-link>
          <template v-if="data.boardId">
            <span class="separator">&nbsp;/&nbsp;</span>
            <router-link
              :to="`/forum/${data.pBoardId}/${data.boardId}`"
              class="a-link"
              >{{ data.boardName }}</router-link
            >
          </template>
        </div>
        <router-link :to="`/post/${data.articleId}`" class="a-link title">
          <span v-if="data.topType == 1" class="top">置顶</span>
          <el-tag v-if="data.status == 0" type="danger">待审核</el-tag>
          <span v-if="htmlTitle" v-html="data.title"></span>
          <span v-else>{{ data.title }}</span>
        </router-link>
        <div class="summary">{{ data.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye-solid">
            {{ data.readCount == 0 ? "阅读" : data.readCount }}
          </span>
          <span class="iconfont icon-good">
            {{ data.goodCount == 0 ? "点赞" : data.goodCount }}
          </span>
          <span class="iconfont icon-comment" v-if="showComment">
            {{ data.commentCount == 0 ? "评论" : data.commentCount }}
          </span>
          <span
            class="iconfont icon-edit a-link"
            v-if="showEdit"
            @click="editArtice(data.articleId)"
            >编辑
          </span>
        </div>
      </div>
      <router-link :to="`/post/${data.articleId}`">
        <cover v-if="data.cover" :cover="data.cover" :width="100"></cover
      ></router-link>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  showComment: {
    type: Boolean,
    default: false,
  },
  showEdit: {
    type: Boolean,
    default: false,
  },
  htmlTitle: {
    type: Boolean,
    default: false,
  },
});

const editArtice = (articleId) => {
  router.push(`/editPost/${articleId}`);
};
</script>
<style lang="less" scoped>
.article-list-item {
  padding: 5px 10px;
  color: #555;
  .article-list-item-inner {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 3px solid rgba(251, 185, 223, 0.2);
    .article-body {
      flex: 1;
      .user-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        .separator {
          color: #fbb9df;
        }
        .a-link {
          margin-left: 5px;
        }
        .post-time {
          font-size: 12px;
          color: #bbb;
        }
      }
      .title {
        display: inline-block;
        margin: 10px 0;
        font-weight: bold;
        font-size: 16px;
        ::v-deep(.el-tag) {
          margin-right: 5px;
          background: #fff;
          color: #61666d;
          border: 1px solid #61666d;
        }
        .top {
          margin-right: 10px;
          padding: 0 2px;
          border-radius: 3px;
          border: 1px solid #fbb9df;
          font-size: 12px;
        }
      }
      .summary {
        font-size: 14px;
      }
      .article-info {
        margin-top: 10px;
        display: flex;
        align-items: center;
        font-size: 12px;
        .iconfont {
          margin-right: 25px;
          font-size: 12px;
          &::before {
            padding-right: 3px;
          }
        }
      }
    }
  }
  &:hover {
    background: rgba(251, 185, 223, 0.1);
    .article-list-item-inner {
      box-shadow: 0 3px 6px 0 rgb(251, 185, 223);
    }
  }
}
</style>