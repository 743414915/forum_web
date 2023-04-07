const config = {
  login: {
    key: 'login',
    options: [
      {
        prop: "email",
        placeholder: "请输入邮箱",
        icon: "iconfont icon-account",
        v_model_trim: "email"
      },
      {
        prop: "password",
        placeholder: "请输入密码",
        icon: "iconfont icon-password",
        v_model_trim: "password",
        eye_type: 'loginPasswordOpen'
      },
      {
        prop: "checkCode",
        placeholder: "请输入验证码",
        icon: "iconfont icon-checkcode",
        v_model_trim: "checkCode",
      },
    ],
  },
  register: {
    key: 'register',
    options: [
      {
        prop: "email",
        placeholder: "请输入邮箱",
        icon: "iconfont icon-account",
        v_model_trim: "email"
      },
      {
        prop: "emailCode",
        placeholder: "请输入邮箱验证码",
        icon: "iconfont icon-checkcode",
        v_model_trim: "emailCode",
      },
      {
        prop: "nickName",
        placeholder: "请输入昵称",
        icon: "iconfont icon-account",
        v_model_trim: "nickName"
      },
      {
        prop: "password",
        placeholder: "请输入密码",
        icon: "iconfont icon-password",
        v_model_trim: "password",
        eye_type: 'registerPasswordOpen'
      },
      {
        prop: "rePassword",
        placeholder: "请再次输入密码",
        icon: "iconfont icon-password",
        v_model_trim: "password",
        eye_type: 'reRegisterPasswordOpen'
      },
      {
        prop: "checkCode",
        placeholder: "请输入验证码",
        icon: "iconfont icon-checkcode",
        v_model_trim: "checkCode",
      },
    ],
  },
  resetPassword: {
    key: 'resetPassword',
    options: [
      {
        prop: "email",
        placeholder: "请输入邮箱",
        icon: "iconfont icon-account",
        v_model_trim: "email"
      },
      {
        prop: "emailCode",
        placeholder: "请输入邮箱验证码",
        icon: "iconfont icon-checkcode",
        v_model_trim: "emailCode",
      },
      {
        prop: "password",
        placeholder: "请输入密码",
        icon: "iconfont icon-password",
        v_model_trim: "password",
        eye_type: 'resetPasswordOpen'
      },
      {
        prop: "rePassword",
        placeholder: "请再次输入密码",
        icon: "iconfont icon-password",
        v_model_trim: "password",
        eye_type: 'reResetPasswordOpen'
      },
      {
        prop: "checkCode",
        placeholder: "请输入验证码",
        icon: "iconfont icon-checkcode",
        v_model_trim: "checkCode",
      },
    ],
  }
}

export default config;