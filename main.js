const enterView = document.querySelector('#EnterView');
enterView.style.opacity = '0';
enterView.style.transition = 'opacity 3s';
setTimeout(() => {
  enterView.style.display = 'none';
}, 3000);
