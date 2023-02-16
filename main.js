const enterView = document.querySelector('#EnterView');
enterView.style.opacity = '0';
enterView.style.transition = 'opacity 1s';
setTimeout(() => {
  enterView.style.display = 'none';
}, 2000);
