import { createApp } from 'vue';
import Vuex from 'vuex';

const store = new Vuex.Store({
  state: {
    ui: {
      theme: 'light'
    }
  },
  mutations: {
    toggleTheme(state) {
      state.ui.theme = state.ui.theme === 'light' ? 'dark' : 'light';
    }
  }
});

const app = createApp({});
app.use(store);
app.mount('#app');