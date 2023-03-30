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
}


function showHome() {
  document.getElementById('homedot').style.display='block';
  document.getElementById('projectsnav').style.display='block';
  document.getElementById('infonav').style.display='block';
  document.getElementById('contactnav').style.display='block';
  document.getElementById('homenav').style.display='none';
  document.getElementById('projectsdot').style.display='none';
  document.getElementById('infodot').style.display='none';
  document.getElementById('contactdot').style.display='none';
}

function showProj() {
  document.getElementById('projectsdot').style.display='block';
  document.getElementById('homenav').style.display='block';
  document.getElementById('infonav').style.display='block';
  document.getElementById('contactnav').style.display='block';
  document.getElementById('projectsnav').style.display='none';
  document.getElementById('homedot').style.display='none';
  document.getElementById('infodot').style.display='none';
  document.getElementById('contactdot').style.display='none';
}

function showInfo() {
  document.getElementById('infodot').style.display='block';
  document.getElementById('homenav').style.display='block';
  document.getElementById('projectsnav').style.display='block';
  document.getElementById('contactnav').style.display='block';
  document.getElementById('infonav').style.display='none';
  document.getElementById('homedot').style.display='none';
  document.getElementById('projectsdot').style.display='none';
  document.getElementById('contactdot').style.display='none';
}

function showCon() {
  document.getElementById('contactdot').style.display='block';
  document.getElementById('homenav').style.display='block';
  document.getElementById('projectsnav').style.display='block';
  document.getElementById('infonav').style.display='block';
  document.getElementById('contactnav').style.display='none';
  document.getElementById('homedot').style.display='none';
  document.getElementById('projectsdot').style.display='none';
  document.getElementById('infodot').style.display='none';
}