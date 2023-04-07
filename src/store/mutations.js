const mutations = {
  updateLoginUserInfo: (state, value) => {
    state.loginUserInfo = value;
  },
  showLogin(state, value) {
    state.showLogin = value;
  }
};

export default mutations;