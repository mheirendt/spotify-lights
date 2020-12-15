import ProfileView from "../components/profile-view";
import Vuex from "vuex";
import Vue from "vue";
import Mutations from "./mutations";
import Getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    playback: null,
  },
  mutations: {
    [Mutations.USER](state, payload) {
      state.user = payload;
    },
    [Mutations.PLAYBACK](state, payload) {
      state.playback = payload;
    }
  },
  getters: {
    [Getters.USER](state) {
      return state.user;
    },
    [Getters.PLAYBACK](state) {
      return state.playback;
    }
  },
  modules: {
    ProfileView
  },
});