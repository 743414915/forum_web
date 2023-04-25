<template>
  <div class="plate-information">
    <router-link :to="'/'" class="a-link">
      <span
        title="首页"
        :class="['a-link', 'menu-item', { active: isHomeActive }]"
        >首页</span
      >
    </router-link>
    <template v-for="(item, index) in boardList" :key="item + index">
      <el-popover
        placement="bottom-start"
        :width="300"
        trigger="hover"
        v-if="item.children.length"
      >
        <template #reference>
          <span
            :class="[
              'a-link',
              'menu-item',
              item.boardId == activePBoardId ? 'active' : '',
            ]"
            @click="boardClickHandler(item)"
            :title="item.boardName"
            >{{ item.boardName }}</span
          >
        </template>
        <div class="children-board-list">
          <span
            :class="[
              'children-board',
              childrenItem.boardId == activeBoardId ? 'active' : '',
            ]"
            v-for="(childrenItem, index) in item.children"
            :key="childrenItem + index"
            @click="subBoardClickHandler(childrenItem)"
            >{{ childrenItem.boardName }}</span
          >
        </div>
      </el-popover>
      <span
        v-else
        :class="[
          'a-link',
          'menu-item',
          item.boardId == activePBoardId ? 'active' : '',
        ]"
        @click="boardClickHandler(item)"
        >{{ item.boardName }}</span
      >
    </template>
  </div>
</template>
<script setup>
import store from "@/store";
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

const props = defineProps({
  boardList: {
    type: Array,
    default: () => [],
  },
});

// 一级板块点击
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};
// 二级板块点击
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pboardId}/${subBoard.boardId}`);
};
// 当前选中的版块
let activePBoardId = ref(0);
let activeBoardId = ref(0);
let isHomeActive = ref(false);

// 监听一级板块
watch(
  () => store.state.activePBoardId,
  (newVal) => {
    if (newVal != undefined) {
      isHomeActive.value = false;
      activePBoardId.value = newVal;
    } else {
      isHomeActive.value = true;
      activePBoardId.value = 0;
    }
  },
  { immediate: true, deep: true }
);
// 监听二级板块
watch(
  () => store.state.activeBoardId,
  (newVal) => {
    activeBoardId.value = newVal;
  },
  { immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.plate-information {
  display: flex;
  max-height: 60px;
  > span,
  > a {
    max-width: 60px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .menu-item {
    margin-left: 20px;
    font-weight: 800;
    &.active {
      color: #fff;
    }
  }
}

.children-board-list {
  display: flex;
  flex-wrap: wrap;
  .children-board {
    padding: 0 10px;
    border-radius: 20px;
    margin-right: 10px;
    background: rgba(251, 185, 223, 0.5);
    border: 1px solid rgba(251, 185, 223, 0.5);
    color: #fbb9df;
    margin-top: 10px;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      // color: rgb(255, 182, 193);
      color: #d56cdf;
    }
    &.active {
      background: #fff;
    }
  }
}
</style>