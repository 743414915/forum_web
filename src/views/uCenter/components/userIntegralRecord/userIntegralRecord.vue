<template>
  <div>
    <Dialog
      :isShow="dialogConfig.isShow"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      :isShowCancel="false"
      @close="dialogConfig.isShow = false"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        label-width="40px"
      >
        <!--input输入-->
        <el-form-item label="日期" prop="createTimeRange">
          <el-date-picker
            v-model="formData.createTimeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="loadRecord"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="data-item">
        <div class="record-type">类型</div>
        <div class="integral">积分</div>
        <div class="create-time">时间</div>
      </div>
      <dataList
        :loading="loading"
        :dataSource="recordListInfo"
        @loadData="loadRecord"
        noDataMsg="暂无相关记录"
      >
        <template #default="{ data }">
          <div class="data-item">
            <div class="record-type">{{ data.operTypeName }}</div>
            <div :class="['integral', data.integral > 0 ? 'add' : 'reduce']">
              {{ data.integral }}
            </div>
            <div class="create-time">{{ data.createTime }}</div>
          </div>
        </template>
      </dataList>
    </Dialog>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  loadUserIntegralRecord: "/ucenter/loadUserIntegralRecord",
};

const dialogConfig = reactive({
  isShow: false,
  title: "查看用户积分记录",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        dialogConfig.isShow = false;
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();

const showRecord = () => {
  dialogConfig.isShow = true;
  nextTick(()=>{
    formDataRef.value.resetFields();
  })
  loadRecord();
};

defineExpose({ showRecord });

const loading = ref(false);
const recordListInfo = ref({});
const loadRecord = () => {
  loading.value = true;
  let params = {
    pageNo: recordListInfo.value.pageNo,
  };
  if (formData.value.createTimeRange) {
    params.createTimeStart = formData.value.createTimeRange[0];
    params.endTimeStart = formData.value.createTimeRange[1];
  }
  proxy
    .request({
      url: api.loadUserIntegralRecord,
      params,
      showLoading: false,
    })
    .then((res) => {
      if (!res || res.code !== 200) {
        return;
      }
      recordListInfo.value = res.data;
      loading.value = false;
    });
};
</script>
<style lang="less" scoped>
.data-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #fff;
  .record-type,
  integral {
    width: 120px;
  }
  .add {
    color: red;
  }
  .reduce {
    color: green;
  }
  .create-time {
    text-align: center;
    flex: 1;
  }
}
</style>