import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

const app = createApp(App);

// Use the Vuex store in the app
app.use(store);

// Hide the EnterView after 3 seconds
const enterView = document.querySelector('#EnterView');
enterView.style.opacity = '0';
enterView.style.transition = 'opacity 3s';
setTimeout(() => {
  enterView.style.display = 'none';
}, 3000);

// Mount the app to the DOM
app.mount('#app');
