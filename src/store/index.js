import ProfileView from "../components/profile-view";
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    playing: null,
  },
  mutations: {
    mutateUser(state, payload) {
      state.user = payload;
    },
    mutatePlaying(state, payload) {
      state.playing = payload;
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getPlaying(state) {
      return state.playing;
    }
  },
  modules: {
    ProfileView
  },
});