function hideEnterView() {
    const enterView = document.querySelector('#EnterView');
    enterView.style.opacity = '0';
    enterView.style.transition = 'opacity 3.5s';
    setTimeout(() => {
      enterView.style.display = 'none';
    }, 3500);
  }

  function show(shown, hidden1, hidden2, hidden3) {
    document.getElementById(shown).style.display='block';
    document.getElementById(hidden1).style.display='none';
    document.getElementById(hidden2).style.display='none';
    document.getElementById(hidden3).style.display='none';
    return false;
  }