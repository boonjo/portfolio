import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    ui: {
      theme: 'light'
    }
  },
  mutations: {
    toggleTheme (state) {
      state.ui.theme = state.ui.theme === 'light' ? 'dark' : 'light';
    }
  }
});
