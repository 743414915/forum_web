<template>
  <div class="comment-list-item">
    <div class="comment-item">
      <avatar :width="50" :userId="commentData.userId"></avatar>
      <div class="comment-info">
        <div class="nick-name">
          <span class="name">{{ commentData.nickName }}</span>
          <span v-if="commentData.userId == articleUserId" class="tag-author"
            >作者</span
          >
        </div>
        <div class="comment-content">
          <span v-html="commentData.content"></span>
        </div>
        <div class="op-panel">
          <div class="time">
            <span>{{ commentData.postTime }}</span>
            <span class="address"
              >&nbsp;·&nbsp;{{ commentData.userIpAddress }}</span
            >
          </div>
          <div class="iconfont icon-good">
            {{ commentData.goodCount > 0 ? commentData.goodCount : "点赞" }}
          </div>
          <div class="iconfont icon-comment" @click="showReplyPanel">回复</div>
          <el-dropdown v-if="isShowToptype">
            <div class="iconfont icon-more"></div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  {{ commentData.toptype == 0 ? "设为置顶" : "取消置顶" }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="reply-info" v-show="commentData.showReply">
          <postComment
            :articleId="articleId"
            :placeholder="placeholder"
            :avatarWidth="30"
            :userId="currentUserId"
            :pCommentId="pCommentId"
            :replyUserId="replyUserId"
            @afterPostComment="afterPostComment"
          ></postComment>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import postComment from "../postComment/postComment.vue";

const emit = defineEmits(["hiddenAllReply"]);
const props = defineProps({
  articleId: {
    type: String,
    default: "",
  },
  commentData: {
    type: Object,
    default: () => {},
  },
  articleUserId: {
    type: String,
    default: "",
  },
  currentUserId: {
    type: String,
    default: "",
  },
});
const placeholder = ref("");

const isShowToptype = computed(() => {
  return (
    props.currentUserId &&
    props.articleUserId &&
    props.currentUserId === props.articleUserId
  );
});

// 显示评论框
const pCommentId = ref(0);
const replyUserId = ref(null);
const showReplyPanel = () => {
  let haveShow = props.commentData.showReply || false;
  emit("hiddenAllReply");
  props.commentData.showReply = !haveShow;
  pCommentId.value = props.commentData.commentId;
  replyUserId.value = props.commentData.userId;
};

// 评论发布完成
const afterPostComment = (resultData) => {
  const children = props.commentData.children || [];
  children.unshift(resultData);
};
</script>
<style lang="less" scoped>
.comment-list-item {
  .comment-item {
    display: flex;
    padding-top: 15px;
    .comment-info {
      flex: 1;
      margin-left: 10px;
      border-bottom: 3px solid rgba(251, 185, 223, 0.2);
      padding-bottom: 15px;
      .nick-name {
        .name {
          font-size: 14px;
          color: #d56cdf;
          margin-right: 10px;
          cursor: pointer;
        }
        .tag-author {
          background: #f69;
          color: #fff;
          font-size: 12px;
          border-radius: 3px;
        }
      }
      .comment-content {
        margin-top: 5px;
        font-size: 15px;
        line-height: 22px;
      }
      .op-panel {
        display: flex;
        align-items: center;
        line-height: 100%;
        margin-top: 5px;
        font-size: 13px;
        color: #bbb;
        .time {
          margin-right: 20px;
          cursor: pointer;
        }
        .iconfont {
          cursor: pointer;
          margin-right: 15px;
          color: #fbb9df;
          font-size: 14px;
          &::before {
            margin-right: 3px;
          }
        }
      }
      .reply-info {
        margin-top: 15px;
      }
    }
  }
}
</style>