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
}
export default actions;