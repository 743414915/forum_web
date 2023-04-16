<template>
  <div class="editor-html">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :model="model"
    ></Toolbar>
    <Editor
      :style="{ height: height + 'px', 'overflow-y': 'hidden' }"
      :model-value="modelValue"
      :defaultConfig="editorConfig"
      :model="model"
      @onCreated="handleCreated"
      @onChange="onChange"
    ></Editor>
  </div>
</template>
<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, ref, shallowRef, getCurrentInstance } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { useStore } from "vuex";
const store = useStore();
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

const model = ref("default");
const editorRef = shallowRef();

const toolbarConfig = {
  excludeKeys: [
    "upoadVideo", // 排除菜单项，写菜单组key的值即可
  ],
};

const handleCreated = (editor) => {
  // 记录editor实例
  editorRef.value = editor;
};
const editorConfig = {
  placeholder: "请输入内容...",
  excludeKeys: ["upoadVideo"],
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 10 * 1024 * 1024,
      server: "api/file/uploadImage",
      fieldName: "file",
      customInstert(responseData, insertFn) {
        // 正常请求
        if (responseData.code === 200) {
          insertFn &&
            insertFn(
              proxy.globalInfo.imageUrl + responseData.data.filePath,
              "",
              ""
            );
          return;
        } else if (responseData.code === 901) {
          // 登陆超时
          store.dispatch("showLogin", true);
          store.dispatch("updateLoginUserInfo", null);
          return;
        }
        proxy.message.error(responseData.info);
      },
    },
  },
};

const emit = defineEmits();
const onChange = (editor) => {
  emit("update:modelValue", editor.getHtml());
};

// 组件销毁，销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) {
    editor.destroy();
  }
});
</script>
<style lang="less" scoped>
</style>