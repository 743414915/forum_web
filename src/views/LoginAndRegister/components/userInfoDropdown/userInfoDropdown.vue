<template>
  <div class="user-info-dropdown">
    <el-dropdown>
      <slot></slot>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in getDropdowns"
            :key="item + index"
            >{{ item.message }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  dropdowns: {
    type: Array,
    default: () => [],
  },
});

const getDropdowns = computed(() => {
  return props.dropdowns;
});
</script>
<style lang="less" scoped>
.user-info-dropdown {
  display: flex;
}
</style>