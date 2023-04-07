<template>
  <div class="plate-information">
    <span class="a-link menu-item">全部</span>
    <template v-for="(item, index) in boardList" :key="item + index">
      <el-popover
        placement="bottom-start"
        :width="300"
        trigger="hover"
        v-if="item.children.length"
      >
        <template #reference>
          <span class="a-link menu-item">{{ item.boardName }}</span>
        </template>
        <div class="children-board-list">
          <span
            class="children-board"
            v-for="(childrenItem, index) in item.children"
            :key="childrenItem + index"
            >{{ childrenItem.boardName }}</span
          >
        </div>
      </el-popover>
      <span v-else class="a-link menu-item">{{ item.boardName }}</span>
    </template>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  boardList: {
    type: Array,
    default: () => [],
  },
});
</script>
<style lang="less" scoped>
.plate-information {
  .menu-item {
    margin-left: 20px;
  }
}

.children-board-list {
  display: flex;
  flex-wrap: wrap;
  .children-board {
    padding: 0 10px;
    border-radius: 20px;
    margin-right: 10px;
    background: rgb(255, 182, 193);
    border: 1px solid rgb(255, 182, 193);
    color: #fff;
    margin-top: 10px;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      color: rgb(255, 182, 193);
      background: #fff;
    }
  }
}
</style>