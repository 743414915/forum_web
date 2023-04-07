import { def } from "@vue/shared";
import { createStore } from "vuex";

import state from "./state";
import getters from "./getters";
import mutations from "./mutations";

export default createStore({
  state,
  getters,
  mutations,
  actions: {},
  modules: {}
})