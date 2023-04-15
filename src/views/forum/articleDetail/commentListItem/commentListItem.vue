<template>
  <div class="comment-list-item">
    <div class="comment-item">
      <avatar :width="50" :userId="commentData.userId"></avatar>
      <div class="comment-info">
        <nickName
          :nickName="commentData.nickName"
          :isShowAuthor="commentData.userId == articleUserId"
          @goToUcenter="goToUcenter(commentData.userId)"
        ></nickName>
        <div class="comment-content">
          <div style="margin-bottom: 10px">
            <span class="tag-topping" v-if="commentData.topType">置顶</span>
            <span class="no-audit" v-if="!commentData.status">待审核</span>
            <span v-html="commentData.content"></span>
          </div>
          <commentImage
            v-if="commentData.imgPath"
            :src="comImgSrc(commentData.imgPath)"
            :imgList="[comImgSrc(commentData.imgPath, true)]"
          ></commentImage>
        </div>
        <div class="op-panel">
          <opPanel
            @showReplyPanel="showReplyPanel(commentData, command)"
            @doLike="doLike(commentData)"
            :postTime="commentData.postTime"
            :userIpAddress="commentData.userIpAddress"
            :goodCount="commentData.goodCount"
            :likeType="commentData.likeType"
          >
            <el-dropdown v-if="isShowToptype" @command="opTop(commentData)">
              <div class="iconfont icon-more"></div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    {{ commentData.topType == 0 ? "设为置顶" : "取消置顶" }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </opPanel>
        </div>
        <!-- 二级评论 -->
        <div class="comment-sub-list" v-if="commentData.children">
          <div
            class="comment-sub-item"
            v-for="(item, index) in commentData.children"
            :key="item + index"
          >
            <avatar :width="30" :userId="item.userId"></avatar>
            <div class="comment-sub-info">
              <nickName
                :nickName="item.nickName"
                :isShowAuthor="item.userId == articleUserId"
                @goToUcenter="goToUcenter(item.userId)"
              >
                <div class="nick-name-slot">
                  <span class="reply-name">回复</span>
                  <span @click="goToUcenter(item.replyUserId)" class="a-link"
                    >@{{ item.replyNickName }}：</span
                  >
                  <span class="sub-content" v-html="item.content"></span>
                </div>
              </nickName>
              <opPanel
                @showReplyPanel="showReplyPanel(item, 'secCom')"
                @doLike="doLike(item)"
                :postTime="item.postTime"
                :userIpAddress="item.userIpAddress"
                :goodCount="item.goodCount"
                :likeType="item.likeType"
              >
              </opPanel>
            </div>
          </div>
        </div>
        <div class="reply-info" v-show="commentData.showReply">
          <commentPost
            :articleId="articleId"
            :placeholder="placeholder"
            :avatarWidth="30"
            :userId="currentUserId"
            :pCommentId="pCommentId"
            :replyUserId="replyUserId"
            @afterPostComment="afterPostComment"
          ></commentPost>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
import { useRouter } from "vue-router";
const router = useRouter();

import commentPost from "../commentPost/commentPost.vue";
import commentImage from "../commentImage/commentImage.vue";
import nickName from "@/components/nickName/nickName.vue";
import opPanel from "@/components/opPanel/opPanel.vue";

const api = {
  postComment: "/comment/postComment",
  doLike: "/comment/doLike",
  changeTopType: "/comment/changeTopType",
};

const emit = defineEmits([
  "hiddenAllReply",
  "afterPostComment",
  "hiddenAllReplyHandler",
  "reloadData",
]);
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

const isShowToptype = computed(() => {
  return (
    props.currentUserId &&
    props.articleUserId &&
    props.currentUserId === props.articleUserId
  );
});

// 显示评论框
const pCommentId = ref(0);
const placeholder = ref("");
const replyUserId = ref(null);
const showReplyPanel = (curData, type) => {
  let commentData = curData;
  let haveShow = commentData.showReply || false;
  emit("hiddenAllReply");
  if (type !== "secCom") {
    props.commentData.showReply = !haveShow;
  } else {
    props.commentData.showReply = true;
  }
  pCommentId.value = props.commentData.commentId;
  replyUserId.value = commentData.userId;
  placeholder.value = "回复 @" + commentData.nickName;
};

// 评论发布完成
const afterPostComment = () => {
  emit("afterPostComment");
  emit("hiddenAllReplyHandler");
};

const goToUcenter = (userId) => {
  router.push(`/user/${userId}`);
};

const doLike = (data) => {
  proxy
    .request({
      url: api.doLike,
      showLoading: false,
      params: {
        commentId: data.commentId,
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      data.goodCount = res.data.goodCount;
      data.likeType = res.data.likeType;
    });
};

// 评论图片路经
const comImgSrc = (path, isList = false) => {
  let src = proxy.globalInfo.imageUrl + path;
  if (!isList) {
    src = src.replace(".", "_.");
  }
  return src;
};

// 置顶
const opTop = (data) => {
  proxy
    .request({
      url: api.changeTopType,
      params: {
        commentId: data.commentId,
        topType: data.topType == 1 ? 0 : 1,
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      emit("reloadData");
    });
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
      .comment-content {
        margin-top: 5px;
        font-size: 15px;
        line-height: 22px;
        .tag-topping,
        .no-audit {
          margin-right: 5px;
          padding: 0 5px;
          color: #f69;
          border: 1px solid #f69;
          font-size: 12px;
          border-radius: 3px;
        }
        .no-audit {
          color: #aaa;
          border: 1px solid #aaa;
        }
      }
      .op-panel {
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
      .comment-sub-list {
        margin-top: 10px;
        .comment-sub-item {
          display: flex;
          margin: 8px 0;
          font-size: 14px;
          .comment-sub-info {
            margin-left: 5px;
            .nick-name-slot {
              display: inline-block;
              .reply-name {
                margin: 0 5px;
              }
              .sub-content {
                font-size: 15px;
              }
            }
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