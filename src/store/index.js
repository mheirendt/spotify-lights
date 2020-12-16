import ProfileView from "../components/profile-view";
import Vuex from "vuex";
import Vue from "vue";
import Mutations from "./mutations";
import Getters from "./getters";

Vue.use(Vuex);

const mutations = {};
Object.values(Mutations).forEach(mutation => {
  mutations[mutation] = function (state, payload) {
    state[mutation] = payload;
  };
});

const getters = {};
Object.values(Getters).forEach(getter => {
  getters[getter] = function (state) {
    return state[getter];
  };
});

export default new Vuex.Store({
  state: {
    [Mutations.USER]: null,
    [Mutations.TRACK]: null,
    [Mutations.PROGRESS]: null
  },
  mutations,
  getters,
  modules: {
    ProfileView
  },
});