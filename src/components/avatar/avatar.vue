<template>
  <div
    class="avatar"
    :style="{
      width: width + 'px',
      height: width + 'px',
      'border-radius': width * 2 + 'px',
    }"
  >
    <el-image
      v-if="userId"
      :style="{
        width: width + 'px',
        height: width + 'px',
        'border-radius': width * 2 + 'px',
      }"
      :src="getAvatarUrl"
      :zoom-rate="1.2"
      fit="scale-down"
      loading="lazy"
      @click="goToUcenter"
    ></el-image>
    <div v-else class="no-login">未登录</div>
  </div>
</template>
<script setup>
import { getCurrentInstance, computed } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

const props = defineProps({
  userId: {
    type: String,
    default: "",
  },
  width: {
    type: Number,
    default: 60,
  },
  addLink: {
    type: Boolean,
    default: true,
  },
});

// 用户头像
const getAvatarUrl = computed(() => {
  return proxy.globalInfo.avatarUrl + props.userId;
});
const goToUcenter = () => {
  if (props.addLink) {
    router.push("/user/" + proxy.userId);
  }
};
</script>
<style lang="less" scoped>
.avatar {
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  background: #f0f0f0;
  .no-login {
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
}
</style>