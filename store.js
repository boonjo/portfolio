import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ui: {
      theme: 'light',
      currentPath: '/',
    },
  },
  mutations: {
    setTheme(state, theme) {
      state.ui.theme = theme;
    },
    setCurrentPath(state, path) {
      state.ui.currentPath = path;
    },
  },
});