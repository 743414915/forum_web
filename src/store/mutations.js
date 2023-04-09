const mutations = {
  updateLoginUserInfo(state, value) {
    state.loginUserInfo = value;
  },
  showLogin(state, value) {
    state.showLogin = value;
  },
  saveBoardList(state, boardList) {
    state.boardList = boardList;
  },
  setActivePBoardId(state, activePBoardId) {
    state.activePBoardId = activePBoardId;
  },
  setActiveBoardId(state, activeBoardId) {
    state.activeBoardId = activeBoardId;
  },
};

export default mutations;