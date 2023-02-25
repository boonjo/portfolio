const enterView = document.querySelector('#EnterView');
enterView.style.opacity = '0';
enterView.style.transition = 'opacity 5s';
setTimeout(() => {
  enterView.style.display = 'none';
}, 5000);
