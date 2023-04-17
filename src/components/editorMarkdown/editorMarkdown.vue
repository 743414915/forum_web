<template>
  <div class="editor-mark-down">
    <v-md-editor
      :model-value="modelValue"
      :height="height + 'px'"
      :disabled-menus="[]"
      :include-level="[1, 2, 3, 4, 5, 6]"
      @upload-image="uploadImageHandler"
      @change="change"
      @save="save"
    ></v-md-editor>
  </div>
</template>
<script setup>
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";

import hljs from "highlight.js";
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: {
    tyoe: String,
    default: "",
  },
  height: {
    tyoe: Number,
    default: 500,
  },
});

let htmlContents = "";
const emit = defineEmits();
const change = (markdownContent, htmlContent) => {
  emit("update:modelValue", markdownContent);
  htmlContents = htmlContent;
};

const save = () => {
  emit("markdownSave", htmlContents);
};

const uploadImageHandler = (event, insertImage, files) => {
  proxy
    .request({
      url: "file/uploadImage",
      params: {
        file: files[0],
      },
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      const url = proxy.globalInfo.imageUrl + res.data.filePath;
      insertImage &&
        insertImage({
          url,
          desc: "图片",
        });
    });
};
</script>
<style lang="less" scoped>
</style>