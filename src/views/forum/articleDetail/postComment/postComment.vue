<template>
  <div class="post-comment">
    <avatar :width="avatarWidth" :userId="userId"></avatar>
    <div class="comment-form">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <!--textarea输入-->
        <el-form-item label="" prop="content">
          <el-input
            clearable
            :placeholder="placeholder"
            type="textarea"
            :maxlength="800"
            resize="none"
            show-word-limit
            v-model.trim="formData.content"
          ></el-input>
          <div class="insert-img" v-if="isShowInsertImage">
            <el-upload
              name="file"
              :show-file-list="false"
              accept=".png .PNG .jpg .JPG .jpeg .JPEG .gif .GIF .bmp .BMP"
              :multiple="false"
              :http-request="selectImg"
            >
              <span class="iconfont icon-image"></span>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="send-btn" @click="postCommentDo">发表</div>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const emit = defineEmits(["afterPostComment"]);
const props = defineProps({
  articleId: {
    type: String,
    default: "",
  },
  avatarWidth: {
    type: Number,
    default: 50,
  },
  userId: {
    type: String,
    default: "",
  },
  isShowInsertImage: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  pCommentId: {
    type: Number,
    default: 0,
  },
  replyUserId: {
    type: String,
    default: "",
  },
});
const api = {
  postComment: "comment/postComment",
};

// 表单数据
const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [{ required: true, message: "请输入评论内容" }],
};

// 发表评论
const postCommentDo = () => {
  formDataRef.value.validateField("content", (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value, {
      articleId: props.articleId,
      pCommentId: props.pCommentId,
      replyUserId: props.replyUserId,
    });
    proxy
      .request({
        url: api.postComment,
        params,
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        proxy.message.success("评论发表成功！");
        formDataRef.value.resetFields();
        emit("afterPostComment", res.data);
      });
  });
};

// 选择图片
const selectImg = () => {};
</script>
<style lang="less" scoped>
.post-comment {
  display: flex;
  align-items: top;
  ::v-deep(.comment-form) {
    flex: 1;
    margin: 0 10px;
    .el-textarea__inner {
      height: 60px;
    }
    .insert-img {
      line-height: normal;
      .iconfont {
        margin-top: 3px;
        font-size: 20px;
        color: #fbb9df;
      }
    }
  }
  .send-btn {
    cursor: pointer;
    width: 60px;
    height: 60px;
    background: rgb(255, 182, 193);
    color: #fff;
    text-align: center;
    line-height: 60px;
    border-radius: 10px;
  }
}
</style>