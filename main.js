import Vue from 'vue';
import App from './App.vue';
import { store } from './store';

new Vue({
  el: '#app',
  store, // add the store to the Vue instance
  render: h => h(App)
});

const store = Vuex.createStore({
  state() {
      return {
          ui: {
              theme: 'light',
          },       
      };
  },
  mutations: {
      toggleTheme(state) {
          state.ui.theme = state.ui.theme === 'light' ? 'dark' : 'light';
      },
  },
});

const app = Vue.createApp({});
app.use(store);
app.mount('#app');