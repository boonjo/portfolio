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

// hide the EnterView element after 3 seconds
const enterView = document.querySelector('#EnterView');
enterView.style.opacity = '0';
enterView.style.transition = 'opacity 3.5s';
setTimeout(() => {
  enterView.style.display = 'none';
}, 3500);
