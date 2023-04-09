<template>
  <div class="login-and-register">
    <Dialog
      :isShow="dialogConfig.isShow"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :isShowCancel="false"
      @close="dialogConfig.isShow = false"
    >
      <el-form class="form" :model="formData" :rules="rules" ref="formDataRef">
        <!--input输入-->
        <el-form-item
          v-for="(item, index) in contentConfig.options"
          :key="item + index"
          :prop="item.prop"
        >
          <div
            :class="['input-panel', { 'check-code-panel': isPanelClass(item) }]"
          >
            <el-input
              :type="
                !isPassword(item) || passwordEyeType[item.eye_type]
                  ? 'text'
                  : 'password'
              "
              size="large"
              :clearable="!isPassword(item)"
              :placeholder="item.placeholder"
              v-model="formData[item.prop]"
              @keyup.enter="btnClick"
            >
              <template #prefix>
                <span :class="item.icon"></span>
              </template>
              <template #suffix>
                <span
                  v-if="isPassword(item)"
                  @click="eyeChange(item.eye_type)"
                  :class="[
                    'eye-pwd',
                    'iconfont',
                    passwordEyeType[item.eye_type]
                      ? 'icon-eye'
                      : 'icon-close-eye',
                  ]"
                ></span>
              </template>
            </el-input>
            <div class="code-and-img">
              <img
                :src="getCheckCodeUrl"
                v-if="item.prop === 'checkCode'"
                class="check-code"
                @click="changeCheckCode(opType)"
              />
              <el-button
                v-if="item.prop === 'emailCode' && opType !== 1"
                type="primary"
                size="large"
                class="get-check-code"
                color="rgb(251, 185, 223)"
                @click="showSendMailCodeDialog"
                >获取验证码</el-button
              >
            </div>
          </div>
          <el-popover placement="left" :width="500" trigger="hover">
            <div>
              <p>1、在垃圾箱中查找邮箱验证码</p>
              <p>2、在邮箱中头像->设置->反垃圾->白名单->设置邮件地址白名单</p>
              <p>3、将邮箱【743414915@qq.com】添加到白名单不知道怎么设置？</p>
              <a href="#" target="_black" class="a-link">不知道怎么设置</a>
            </div>
            <template #reference>
              <span class="shao-nv-fen a-link" v-if="item.prop === 'emailCode'">
                未收到邮箱验证码
              </span>
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item v-if="opType === 1">
          <div class="remember-me">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="isShowPanel(2)"
              >忘记密码？</a
            >
            <a href="javascript:void(0)" class="a-link" @click="isShowPanel(0)"
              >没有账号？</a
            >
          </div>
        </el-form-item>
        <el-form-item v-else-if="opType === 0">
          <div class="remember-me">
            <a href="javascript:void(0)" class="a-link" @click="isShowPanel(1)"
              >已有账号？</a
            >
          </div>
        </el-form-item>
        <el-form-item v-else-if="opType === 2">
          <div class="remember-me">
            <a href="javascript:void(0)" class="a-link" @click="isShowPanel(1)"
              >去登陆</a
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="btnClick"
            type="primary"
            class="op-btn"
            color="rgb(251, 185, 223)"
          >
            <span v-if="opType === 0">注册</span>
            <span v-if="opType === 1">登录</span>
            <span v-if="opType === 2">重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- 发送邮箱验证码 -->
    <Dialog
      :isShow="dialogConfig4SendMailCode.isShow"
      :title="dialogConfig4SendMailCode.title"
      :buttons="dialogConfig4SendMailCode.buttons"
      width="500px"
      :isShowCancel="false"
      class="mail-code"
      @close="cancelSendMailCodeDialog"
    >
      <el-form
        :model="formData4SendMailCode"
        :rules="rules"
        ref="formData4SendMailCodeRef"
        @submit.prevent
      >
        <!--textarea输入-->
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <el-input
            size="large"
            clearable
            placeholder="请输入验证码"
            v-model="formData4SendMailCode.checkCode"
            class="check-code-panel"
          >
            <template #prefix>
              <span class="iconfont icon-checkcode"></span>
            </template>
          </el-input>
          <img
            :src="checkCodeObj.checkCodeUrl4SendMailCode"
            class="check-code"
            @click="changeCheckCode(1, 'emailcode')"
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>
<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  watch,
  nextTick,
  computed,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

import description from "./description.js";
import md5 from "js-md5";

// ==========================compouted=========================
const getCheckCodeUrl = computed((proxy) => {
  return checkCodeObj[contentConfig.value.key + "CheckCodeUrl"];
});
// ==========================data=========================
const api = {
  checkCode: "/api/account/checkCode",
  sendEmailCode: "/account/sendEmailCode",
  register: "/account/register",
  login: "/account/login",
  resetPwd: "/account/resetPwd",
};
const checkCodeObj = reactive({
  loginCheckCodeUrl: api.checkCode,
  registerCheckCodeUrl: api.checkCode,
  checkCodeUrl4SendMailCode: api.checkCode,
  resetPasswordCheckCodeUrl: api.checkCode,
});
// 0: 注册   1：登录   2：找回密码
let opType = ref();
const formData = reactive({
  email: "",
  password: "",
  checkCode: "",
  emailCode: "",
  nickName: "",
  rePassword: "",
});
const checkRePassword = (rule, value, callback) => {
  if (!callback) {
    return;
  }
  if (value !== formData.password) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const formDataRef = ref();
const rules = {
  email: [
    { required: true, message: "请输入邮箱" },
    { max: 150, message: "长度为1-150个字符" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱" },
  ],
  password: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码不能为纯数字或字母，且只能是数字，字母，特殊字符，8-18位",
    },
  ],
  emailCode: [{ required: true, message: "请输入邮箱验证码" }],
  nickName: [
    { required: true, message: "请输入昵称" },
    { max: 20, message: "长度为1-20个字符" },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: [{ required: true, message: "请输入图片验证码" }],
};
const dialogConfig = reactive({
  isShow: false,
  title: "标题",
});
let contentConfig = ref(description.login);

// 密码显示隐藏操作
const passwordEyeType = reactive({
  loginPasswordOpen: false,
  registerPasswordOpen: false,
  reRegisterPasswordOpen: false,
  resetPasswordOpen: false,
  reResetPasswordOpen: false,
});

watch(opType, (newValue, oldValue) => {
  nextTick(() => {
    // 重置表单
    if (newValue === 0) {
      contentConfig.value = description.register;
      dialogConfig.title = "注册";
    } else if (newValue === 1) {
      contentConfig.value = description.login;
      dialogConfig.title = "登录";
    } else if (newValue === 2) {
      contentConfig.value = description.resetPassword;
      dialogConfig.title = "重置密码";
    }

    formDataRef.value.resetFields();
    proxy.VueCookies.remove("loginInfo");
  });
});
watch(dialogConfig, (newValue) => {
  newValue.isShow &&
    nextTick(() => {
      changeCheckCode(0);
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookieLoginInfo && opType.value === 1) {
        formData.value = cookieLoginInfo;
      }
    });
});

// ========================methods======================
const isPassword = (item) => {
  return item.v_model_trim === "password";
};
const eyeChange = (eyeType) => {
  passwordEyeType[eyeType] = !passwordEyeType[eyeType];
};
const isPanelClass = (item) => {
  if (["checkCode"].includes(item.prop)) {
    return true;
  }
  if (opType === 0 || ["emailCode"].includes(item.prop)) {
    return true;
  }
  return false;
};
// 验证码
const changeCheckCode = (type, codeType = "") => {
  let checkCode = `${api.checkCode}?type=${type}&time=${new Date().getTime()}`;
  if (type === 1 && codeType === "emailcode") {
    // 邮箱验证码
    checkCodeObj.checkCodeUrl4SendMailCode = checkCode;
  } else {
    checkCodeObj[contentConfig.value.key + "CheckCodeUrl"] = checkCode;
  }
};
const isShowPanel = (type) => {
  opType.value = type;
  dialogConfig.isShow = true;
};

// 发送邮箱验证码弹窗

const formData4SendMailCode = reactive({
  email: "",
  checkCode: "",
});
const formData4SendMailCodeRef = ref();
const dialogConfig4SendMailCode = reactive({
  isShow: false,
  title: "发送邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      click: () => {
        return sendEmailCode();
      },
    },
  ],
});
const showSendMailCodeDialog = () => {
  formDataRef.value.validateField("email", (valid) => {
    if (!valid) {
      return;
    }
    dialogConfig4SendMailCode.isShow = true;
    nextTick(() => {
      changeCheckCode(1);
      formData4SendMailCodeRef.value.resetFields();
      formData4SendMailCode.email = formData.email;
    });
  });
};
// 发送邮件
const sendEmailCode = () => {
  formData4SendMailCodeRef.value.validateField("checkCode", (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData4SendMailCode, {
      type: opType.value,
    });
    proxy
      .request({
        url: api.sendEmailCode,
        params,
        errorCallback: () => {
          changeCheckCode(1, "emailcode");
        },
      })
      .then((res) => {
        if (res.code != 200) {
          return;
        }
        proxy.message.success("验证码发送成功,请登陆邮箱查看");
        cancelSendMailCodeDialog();
      })
      .catch((err) => {});
  });
};
const cancelSendMailCodeDialog = () => {
  dialogConfig4SendMailCode.isShow = false;
};

// ======================登录、注册、重置密码按钮事件组=============================
// 获取请求url
const getUrl = () => {
  let url = "";
  if (opType.value === 0) {
    // 注册
    url = api.register;
  } else if (opType.value === 1) {
    // 登录
    url = api.login;
  } else if (opType.value === 2) {
    // 重置密码
    url = api.resetPwd;
  }
  return url;
};
const sendAfterBySuccess = (res) => {
  let message = "";
  if (opType.value === 0) {
    message = "注册成功，去登陆";
  } else if (opType.value === 1) {
    dialogConfig.isShow = false;
    message = "登陆成功";
    store.commit("updateLoginUserInfo", res.data);
  } else if (opType.value === 2) {
    message = "重置密码成功，去登陆";
  }
  proxy.message.success(message);
  opType.value !== 1 && isShowPanel(1);
};
const btnClick = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData);
    // 登录
    if (opType.value === 1) {
      let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      let cookiePassword = cookieLoginInfo && cookieLoginInfo.password;
      if (params.password != cookiePassword) {
        params.password = md5(params.password);
      }
    }
    let url = getUrl();
    proxy
      .request({
        url,
        params,
        errorCallback: () => {
          changeCheckCode(0);
        },
      })
      .then((res) => {
        if (!res && res.code !== 200) {
          return;
        }
        // 说明现在是登录
        if (opType == 1) {
          const loginInfo = {
            email: params.email,
            password: params.password,
            rememberMe: params.rememberMe,
          };
          if (params.rememberMe) {
            proxy.VueCookies.set("loginInfo", loginInfo, "7d");
          } else {
            proxy.VueCookies.remove("loginInfo");
          }
        }
        // 返回
        sendAfterBySuccess(res);
      });
  });
};
defineExpose({ isShowPanel });
</script>
<style lang="less" scoped>
@shao_nv_fen: rgb(251, 185, 223);
@ying-hua-fen: rgb(255, 182, 193);

.el-button {
  color: #fff;
}
.login-and-register {
  .check-code-panel {
    display: flex;
    .check-code,
    .get-check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .mail-code {
    ::v-deep(.el-form-item__content) {
      flex-wrap: nowrap;
      img {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .form {
    .input-panel {
      width: 100%;
      .eye-pwd {
        cursor: pointer;
      }
      .code-and-img {
        display: flex;
      }
    }
    .remember-me {
      width: 100%;
      color: @shao_nv_fen;
    }
    .no-account {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .op-btn {
      width: 100%;
    }
  }
}
</style>