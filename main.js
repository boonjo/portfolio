import { createApp } from 'vue';
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      ui: {
        theme: 'light'
      }
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
