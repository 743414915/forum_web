<template>
  <div class="error">
    <div class="info">404</div>
    <div><router-link to="/" class="a-link">返回首页</router-link></div>
  </div>
</template>
<script setup>
</script>
<style lang="less" scoped>
.error {
  text-align: center;
  padding-top: 200px;
  .info,
  .a-link {
    color: rgb(26, 149, 231);
  }
  .info {
    font-size: 100px;
  }
}
</style>