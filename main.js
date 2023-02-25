import Vue from 'vue';
import App from './App.vue';
import { store } from './store';

new Vue({
  el: '#app',
  store, // add the store to the Vue instance
  render: h => h(App)
});
