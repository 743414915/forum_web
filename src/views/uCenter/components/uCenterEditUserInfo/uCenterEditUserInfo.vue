<template>
  <div>
    <Dialog
      :isShow="dialogConfig.isShow"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="450px"
      :isShowCancel="false"
      @close="dialogConfig.isShow = false"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        label-width="60px"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="昵称" prop="nickName">
          {{ formData.nickName }}
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <coverUpload
            :imageUrlPrefix="proxy.globalInfo.avatarUrl"
            v-model="formData.avatar"
          ></coverUpload>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--textarea输入-->
        <el-form-item label="简介" prop="personDescription">
          <el-input
            clearable
            placeholder="请输入简介"
            type="textarea"
            :rows="5"
            :maxlength="100"
            resize="none"
            show-word-limit
            v-model="formData.personDescription"
          ></el-input>
        </el-form-item>
      </el-form>
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
  updatedUserInfo: "/ucenter/updateUserInfo",
};

const dialogConfig = reactive({
  isShow: false,
  title: "编辑个人信息",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        updatedUserInfoHandler();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();

const updatedUserInfoHandler = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    proxy
      .request({
        url: api.updatedUserInfo,
        params,
      })
      .then((res) => {
        if (!res || res.code !== 200) {
          return;
        }
        dialogConfig.isShow = false;
        proxy.message.success("修改成功")
        router.go(0);
      });
  });
};

const showEditUserInfoDialog = (userInfo) => {
  dialogConfig.isShow = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    const dataInfo = JSON.parse(JSON.stringify(userInfo));
    dataInfo.avatar = {
      imageUrl: dataInfo.userId,
    };
    formData.value = dataInfo;
  });
};

defineExpose({ showEditUserInfoDialog });
</script>
<style lang="less" scoped>
</style>