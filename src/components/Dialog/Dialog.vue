<template>
  <div>
    <el-dialog
      :model-value="isShow"
      :title="title"
      :draggable="true"
      :close-on-click-modal="true"
      :show-close="isShowClose"
      class="dialog-class"
      :width="dialogWidth"
      :top="top"
      @close="close"
    >
      <div class="dialog-body">
        <slot></slot>
      </div>
      <template v-if="buttons.length || isShowCancel">
        <div class="dialog-footer">
          <el-button
            color="rgb(251, 185, 223)"
            link
            @click="close"
            v-if="isShowCancel"
            >取消</el-button
          >
          <el-button
            v-for="(btn, index) in buttons"
            :key="btn + index"
            :type="btn.type"
            @click="btn.click"
            color="rgb(251, 185, 223)"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { watch } from "vue";

// ========================props=========================
const props = defineProps({
  isShow: {
    type: Boolean,
    default: true,
  },
  isShowClose: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "这是一个标题",
  },
  dialogWidth: {
    type: String,
    default: "30%",
  },
  top: {
    type: String,
    default: "50px",
  },
  buttons: {
    type: Array,
    default: () => [],
  },
  isShowCancel: {
    type: Boolean,
    default: true,
  },
});

// ========================methods======================
const emit = defineEmits();
const close = () => {
  emit("close");
};
</script>
<style lang="less">
.dialog-class {
  margin-bottom: 10px;
  .el-dialog__body {
    padding: 0;
    .dialog-body {
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      padding: 15px;
      min-height: 100px;
      max-height: calc(100vh - 200px);
      overflow: auto;
    }
    .dialog-footer {
      text-align: right;
      padding: 10px 20px;
      .el-button {
        color: #fff;
      }
    }
  }
}
</style>