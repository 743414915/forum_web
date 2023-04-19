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
  updateMessageCountInfo(state, messageCountInfo) {
    state.messageCountInfo = messageCountInfo;
  },
  readMessage(state, key) {
    state.messageCountInfo.total = state.messageCountInfo.total - state.messageCountInfo[key]
    state.messageCountInfo[key] = 0;
  },
  saveSysSetting(state, sysSetting) {
    state.sysSetting = sysSetting;
  }
};

export default mutations;