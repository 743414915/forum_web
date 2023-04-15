<template>
  <div class="nick-name">
    <span class="name" @click="goToUcenter">{{ nickName }}</span>
    <span v-if="isShowAuthor" class="tag-author">作者</span>
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  nickName: {
    type: String,
    default: "",
  },
  isShowAuthor: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["goToUcenter"]);
const goToUcenter = () => {
  emit("goToUcenter");
};
</script>
<style lang="less" scoped>
.nick-name {
  .name {
    font-size: 14px;
    color: #d56cdf;
    margin-right: 10px;
    cursor: pointer;
  }
  .tag-author {
    padding: 0 3px;
    background: #f69;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
  }
}
</style>