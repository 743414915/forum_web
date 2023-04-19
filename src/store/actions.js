const actions = {
  updateLoginUserInfo: ({ commit }, payload) => {
    commit('updateLoginUserInfo', payload);
  },
  showLogin: ({ commit }, payload) => {
    commit('showLogin', payload);
  },
  saveBoardList: ({ commit }, payload) => {
    commit('saveBoardList', payload);
  },
  setActivePBoardId: ({ commit }, payload) => {
    commit('setActivePBoardId', payload);
  },
  setActiveBoardId: ({ commit }, payload) => {
    commit('setActiveBoardId', payload);
  },
  updateMessageCountInfo: ({ commit }, payload) => {
    commit('updateMessageCountInfo', payload);
  },
  readMessage: ({ commit }, payload) => {
    commit('readMessage', payload);
  },
  saveSysSetting: ({ commit }, payload) => {
    commit('saveSysSetting', payload);
  },
}
export default actions;