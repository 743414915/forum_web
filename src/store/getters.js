const getters = {
  getLoginUserInfo(state) {
    return state.loginUserInfo;
  },
  getBoardList(state) {
    return state.boardList;
  },
  getSubBoardList(state) {
    return (pBoardId) => {
      let board = state.boardList.find((item) => {
        return item.boardId == pBoardId;
      })
      return board ? board.children : [];
    }
  },
  getActivePBoardId(state) {
    return state.activePBoardId;
  },
  getActiveBoardId(state) {
    return state.activeBoardId;
  }
};

export default getters;