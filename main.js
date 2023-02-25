// hide the EnterView element after 3 seconds
const enterView = document.querySelector('#EnterView');
enterView.style.opacity = '0';
enterView.style.transition = 'opacity 3.5s';
setTimeout(() => {
  enterView.style.display = 'none';
}, 3500);
