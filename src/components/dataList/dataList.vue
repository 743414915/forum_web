<template>
  <div class="dataList">
    <noData :msg="msg" :isShow="isNoDataShow"></noData>
    <div class="skeleton" v-if="loading">
      <el-skeleton :throttle="throttle" :row="row" :animated="animated">
      </el-skeleton>
    </div>
    <template v-else
      ><div v-for="(item, index) in dataSource.list" :key="item + index">
        <slot :data="item"></slot>
      </div>
    </template>
    <div class="pagination" v-if="!isNoDataShow">
      <el-pagination
        v-if="dataSource.pageTotal > 1 && !loading"
        background
        :total="dataSource.totalCount"
        :page-size="dataSource.pageSize"
        :current-page="dataSource.pageNo"
        layout="next, pager, prev"
        @current-change="handlePageNoChange"
        style="text-align: right"
      ></el-pagination>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  dataSource: {
    type: Object,
    default: () => {},
  },
  row: {
    type: Number,
    default: 2,
  },
  animated: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  throttle: {
    type: Number,
    default: 500,
  },
});

let msg = ref("空空如也");
const isNoDataShow = computed(() => {
  let { loading, dataSource } = props;
  return (
    !loading &&
    (!dataSource.list || (dataSource.list && !dataSource.list.length))
  );
});

// 分页;
const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
};
</script>
<style lang="less" scoped>
.dataList {
  .skeleton {
    padding: 5px;
  }
  .pagination {
    padding: 5px 10px 10px 10px;
    ::v-deep(.el-pagination) {
      flex-direction: row-reverse;
    }
  }
}
</style>