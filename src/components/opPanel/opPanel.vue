<template>
  <div class="op-panel">
    <div class="time">
      <span>{{ postTime }}</span>
      <span class="address">&nbsp;·&nbsp;{{ userIpAddress }}</span>
    </div>
    <div
      :class="['iconfont', 'icon-good', likeType == 1 ? 'active' : '']"
      @click="doLike"
    >
      {{ goodCount }}
    </div>
    <div class="iconfont icon-comment" @click="showReplyPanel">回复</div>
    <slot></slot>
  </div>
</template>
<script setup>
const props = defineProps({
  postTime: {
    type: String,
    default: "",
  },
  userIpAddress: {
    type: String,
    default: "",
  },
  goodCount: {
    type: Number,
    default: 0,
  },
  likeType: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["showReplyPanel", "doLike"]);
const showReplyPanel = () => {
  emit("showReplyPanel");
};
const doLike = () => {
  emit("doLike");
};
</script>
<style lang="less" scoped>
.op-panel {
  display: flex;
  align-items: center;
  line-height: 100%;
  margin-top: 5px;
  font-size: 13px;
  color: #bbb;
  .time {
    margin-right: 20px;
    cursor: pointer;
  }
  .iconfont {
    cursor: pointer;
    margin-right: 15px;
    color: #fbb9df;
    font-size: 14px;
    &::before {
      margin-right: 3px;
    }
  }
  .active {
    color: #f69;
  }
}
</style>