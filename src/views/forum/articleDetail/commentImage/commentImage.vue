<template>
  <div class="comment-image">
    <el-image
      class="comment-img"
      :src="src"
      :zoom-rate="1.2"
      :preview-src-list="imgList ? imgList : [src]"
      :initial-index="0"
      fit="scale-down"
      loading="lazy"
      hide-on-click-modal
    ></el-image>
  </div>
</template>
<script setup>
const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  imgList: {
    type: Array,
    default: () => [],
  },
});
</script>
<style lang="less" scoped>
.comment-image {
  ::v-deep(.comment-img) {
    cursor: pointer;
    width: 80px;
    height: 80px;
    background: #eee;
  }
}
</style>