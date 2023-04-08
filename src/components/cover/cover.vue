<template>
  <div class="cover" :style="{ width: width + 'px', height: width + 'px' }">
    <el-image class="image" fit="scale-down" loading="lazy" :src="getImageUrl"></el-image>
  </div>
</template>
<script setup>
import { getCurrentInstance, computed } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  cover: {
    type: String,
    default: "",
  },
  width: {
    type: Number,
    default: 60,
  },
});

const getImageUrl = computed(() => {
  return proxy.globalInfo.imageUrl + props.cover;
});
</script>
<style lang="less" scoped>
.cover {
  background: #ddd;
  border-radius: 10px;
  overflow: hidden;
  .image{
    width: 100%;
    height: 100%;
  }
}
</style>