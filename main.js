function hideEnterView() {
    const enterView = document.querySelector('#EnterView');
    enterView.style.opacity = '0';
    enterView.style.transition = 'opacity 3.5s';
    setTimeout(() => {
      enterView.style.display = 'none';
    }, 3500);
  }
  
  // Call the function when the window has finished loading
  window.onload = function() {
    hideEnterView();
  };