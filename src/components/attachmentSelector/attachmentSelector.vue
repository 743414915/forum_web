<template>
  <div class="attachment-selector">
    <template v-if="modelValue">
      <div class="file-name" :title="modelValue.name">
        {{ modelValue.name }}
      </div>
      <span class="iconfont icon-del" @click="delFile"></span>
    </template>
    <el-upload
      v-else
      name="file"
      :show-file-list="false"
      accept=".zip, .rar"
      :multiple="false"
      :http-request="selectFile"
    >
      <el-button class="file-btn" color="rgb(255,182,193)" type="primary"
        >选择文件</el-button
      >
    </el-upload>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits();
const selectFile = ({ file }) => {
  emit("update:modelValue", file);
};

const delFile = () => {
  emit("update:modelValue", null);
};
</script>
<style lang="less" scoped>
.attachment-selector {
  display: flex;
  width: 100%;
  .file-name {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgb(251, 185, 223);
  }
  .iconfont {
    width: 20px;
    color: #fbb9df;
    cursor: pointer;
    margin-left: 10px;
  }
  .file-btn {
    color: #fff;
  }
}
</style>