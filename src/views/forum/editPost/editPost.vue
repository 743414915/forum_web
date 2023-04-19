<template>
  <div class="edit-post">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="60px"
      class="post-panel"
      @submit.prevent
    >
      <div class="post-edit">
        <el-card :body-style="{ padding: '5px' }" class="box-card">
          <template #header>
            <div class="post-editor-title">
              <span>正文</span>
              <div class="change-editor-type a-link">
                <span class="iconfont icon-change" @click="changeEditor">
                  <span>切换为</span>
                  <span v-if="editorType">富文本编辑器</span>
                  <span v-else>markdown编辑器</span>
                </span>
              </div>
            </div>
          </template>
          <!--input输入-->
          <el-form-item prop="content" label-width="0" class="editor-panel">
            <editorMarkdown
              :height="markdownHeight"
              ref="editorMarkdownRef"
              v-show="editorType"
              v-model="formData.markdownContent"
              @markdownSave="markdownSave"
            ></editorMarkdown>
            <editorHtml
              :height="htmlEditorHright"
              ref="editorHtmlRef"
              v-show="!editorType"
              v-model="formData.content"
            ></editorHtml>
          </el-form-item>
        </el-card>
      </div>
      <div class="post-setting">
        <el-card :body-style="{ padding: '5px' }" class="box-card">
          <template #header>
            <span>设置</span>
          </template>
          <div class="setting-inner">
            <!--input输入-->
            <el-form-item label="标题" prop="title">
              <el-input
                clearable
                placeholder="提示信息"
                v-model.trim="formData.title"
              ></el-input>
            </el-form-item>
            <!-- 板块 -->
            <el-form-item label="板块" prop="boardIds">
              <el-cascader
                clearable
                placeholder="请选择板块"
                v-model="formData.boardIds"
                :options="boardList"
                :props="boardProps"
                :style="{ width: '100%' }"
              >
              </el-cascader>
            </el-form-item>
            <!-- 封面 -->
            <el-form-item label="封面" prop="cover">
              <coverUpload v-model="formData.cover"></coverUpload>
            </el-form-item>
            <!--textarea输入-->
            <el-form-item label="摘要" prop="summary">
              <el-input
                clearable
                placeholder="提示信息"
                type="textarea"
                :rows="5"
                :maxlength="200"
                resize="none"
                show-word-limit
                v-model="formData.summary"
              ></el-input>
            </el-form-item>
            <el-form-item label="附件" prop="cover">
              <attachmentSelector
                v-model="formData.attachment"
              ></attachmentSelector>
            </el-form-item>
            <!--input输入-->
            <el-form-item
              label="积分"
              prop="integral"
              v-if="formData.attachment"
            >
              <el-input
                clearable
                placeholder="请输入积分"
                v-model="formData.integral"
              ></el-input>
              <span class="tips">tips：附件下载积分,0表示无需积分下载</span>
            </el-form-item>
            <!--input输入-->
            <el-form-item label="" prop="">
              <el-button
                color="rgb(255,182,193)"
                type="primary"
                :style="{ width: '100%' }"
                class="save-btn"
                @click="postHandler"
                >保存</el-button
              >
            </el-form-item>
          </div>
        </el-card>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, reactive, getCurrentInstance, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const editorMarkdownRef = ref();
const editorHtmlRef = ref();
const markdownHeight = ref(window.innerHeight - 80 -50);
// 60是顶部悬浮栏的高度   37是编辑器标题的高度
const htmlEditorHright = ref(window.innerHeight - 80 -100);
// nextTick(() => {
//   markdownHeight.value =
//     markdownHeight.value - $(editorMarkdownRef.value.$el).offset().top;
//     console.log(markdownHeight.value)
//     console.log($(editorMarkdownRef.value.$el).scrollTop())
//   // htmlEditorHright.value =
//   //   htmlEditorHright.value - $(editorHtmlRef.value.$el).offset().top - 90;
// });

const api = {
  loadBoard4Post: "forum/loadBoard4Post",
  postArticle: "forum/postArticle",
  articleDetail4Update: "forum/articleDetail4Update",
  updateArticle: "forum/updateArticle",
};

const articleId = ref(null);
const getArticleDetail = () => {
  nextTick(() => {
    formDataRef.value.resetFields();
    if (articleId.value) {
      // 修改
      proxy
        .request({
          url: api.articleDetail4Update,
          params: {
            articleId: articleId.value,
          },
          showError: false,
          errorCallback: (response) => {
            ElMessageBox.alert(response.info, "错误", {
              "show-close": false,
              callback: (action) => {
                router.go(-1);
              },
            });
          },
        })
        .then((res) => {
          if (!res || res.code !== 200) {
            return;
          }
          let articleInfo = res.data.forumArticleVO;
          // 设置编辑器
          editorType.value = articleInfo.editorType;
          // 设置板块信息
          articleInfo.boardIds = [];
          articleInfo.boardIds.push(articleInfo.pBoardId);
          if (articleInfo.boardId != null && articleInfo.pBoardId) {
            articleInfo.boardIds.push(articleInfo.boardId);
          }
          // 设置封面信息
          if (articleInfo.cover) {
            articleInfo.cover = { imageUrl: articleInfo.cover };
          }
          // 设置附件
          const attachmentVO = res.data.attachmentVO;
          if (attachmentVO) {
            articleInfo.attachment = {
              name: attachmentVO.fileName,
            };
            articleInfo.integral = attachmentVO.integral;
          }

          formData.value = articleInfo;
        });
    } else {
      // 新增
      formData.value = {};
      editorType.value = Number(proxy.VueCookies.get("editorType")) || 0;
    }
  });
};

// 设置markdown编辑器的富文本信息
const markdownSave = (htmlContents) => {
  formData.value.content = htmlContents;
};

watch(
  () => route,
  (newVal, oldVal) => {
    if (
      newVal.path.indexOf("/editPost") != -1 ||
      newVal.path.indexOf("/newPost") != -1
    ) {
      articleId.value = newVal.params.articleId;
      getArticleDetail();
    }
  },
  { immediate: true, deep: true }
);

const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [
    { required: true, message: "请输入标题" },
    { max: 150, message: "标题最大为150个字符" },
  ],
  boardIds: [{ required: true, message: "请选择板块" }],
  content: [{ required: true, message: "请输入正文" }],
  summary: [{ max: 200, message: "内容最大为200个字符" }],
  integral: [
    { required: true, message: "请输入下载所需积分" },
    { validator: proxy.Verify.number, message: "积分只能是数字" },
  ],
};

// 保存
const postHandler = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    // 设置板块Id
    if (params.boardIds.length == 1) {
      params.pBoardId = params.boardIds[0];
    } else if (params.boardIds.length == 2) {
      params.pBoardId = params.boardIds[0];
      params.boardId = params.boardIds[1];
    }
    delete params.boardIds;
    // 设置编辑器类型
    params.editorType = editorType.value;
    // 获取内容
    const contentText = params.content.replace(/<(?!img).*?>/g, "");
    if (contentText == "") {
      proxy.message.warning("正文不能为空");
      return;
    }
    if (params.attachment != null) {
      params.attachmentType = 1;
    } else {
      params.attachmentType = 0;
    }
    // 封面
    if (!(params.cover instanceof File)) {
      delete params.cover;
    }
    // 附件不是文件类型，值设置为空
    if (!(params.attachment instanceof File)) {
      delete params.attachment;
    }
    let url = params.articleId ? api.updateArticle : api.postArticle;
    proxy
      .request({
        url,
        params,
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        proxy.message.success("保存成功！");
        router.push(`/post/${res.data}`);
      });
  });
};

// 板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "boardId",
  label: "boardName",
};
const boardList = ref([]);
const loadBoardList = () => {
  proxy
    .request({
      url: api.loadBoard4Post,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      boardList.value = res.data;
    });
};
loadBoardList();

// 切换编辑器类型  0:富文本  1:markdown
const editorType = ref(null);
const changeEditor = () => {
  proxy.confirm("切换编辑器会清空正在编辑的内容,确定要切换吗？", () => {
    editorType.value = editorType.value === 0 ? 1 : 0;
    formData.value.content = "";
    formData.value.markdownContent = "";
    proxy.VueCookies.set("editorType", editorType.value, -1);
  });
};
</script>
<style lang="less" scoped>
.edit-post {
  .post-panel {
    display: flex;
    ::v-deep(.el-card__header) {
      padding: 10px 5px 5px 10px;
    }
    .post-edit {
      flex: 1;
      ::v-deep(.el-form-item__content) {
        display: block;
      }
      .post-editor-title {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        .change-editor-type {
          .iconfont {
            font-size: 13px;
          }
        }
      }
    }
    .post-setting {
      margin-left: 10px;
      width: 450px;
      .setting-inner {
        max-height: calc(100vh - 100px);
        overflow: auto;
        .el-form-item {
          align-items: start;
        }
        .tips {
          color: #ccc;
        }
        .save-btn {
          color: #fff;
        }
      }
    }
  }
}
</style>