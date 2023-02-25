import Vuex from 'vuex';

// define the app instance
const app = Vue.createApp({
  // app options here
});

// define the store instance
const store = Vuex.createStore({
  // store options here
});

// mount the store to the app
app.use(store);

// mount the app to the DOM
app.mount('#app');

// hide the EnterView element after 3 seconds
const enterView = document.querySelector('#EnterView');
enterView.style.opacity = '0';
enterView.style.transition = 'opacity 3s';
setTimeout(() => {
  enterView.style.display = 'none';
}, 3000);
