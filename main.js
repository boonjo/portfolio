import Vue from 'vue';
import store from './store';
import MyComponent from './MyComponent.vue';

new Vue({
  store,
  components: { MyComponent },
  template: '<my-component></my-component>',
}).$mount('#app');

const enterView = document.querySelector('#EnterView');
enterView.style.opacity = '0';
enterView.style.transition = 'opacity 1s';
setTimeout(() => {
  enterView.style.display = 'none';
}, 1000);
