function hideEnterView() {
    const enterView = document.querySelector('#EnterView');
    setTimeout(() => {
      enterView.style.opacity = '0';
      enterView.style.transition = 'opacity 2s';
    }, 1500);
    setTimeout(() => {
      enterView.style.display = 'none';
    }, 4000);
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

var tl = gsap.timeline({onComplete: createDoodle});

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createDoodle(){

var widthLeft = randomIntFromInterval(50,250);
var widthRight = 600 - widthLeft;

for (let i = 0; i < 3; i++) {
	var pointX = randomIntFromInterval(0,700);
	var pointY = randomIntFromInterval(0,700);
	var pointXa = randomIntFromInterval(0,700);
	var pointYa = randomIntFromInterval(700,0);
	curve [i] = "M" + widthLeft  + ",300 C" + pointX + "," + pointY + " " + pointXa + ","+ pointYa + " " + widthRight + ",300";
}

// Animate 
tl.to('#curve', 	{delay:0.5, duration: 1,attr: { d: curve[0]}, ease: "power3.inOut"});
tl.to('#curve1', 	{duration: 1,attr: { d: curve[1]},  ease: "power3.inOut"}, "<");
tl.to('#curve2', 	{duration: 1,attr: { d: curve[2]},  ease: "power3.inOut"}, "<");
}

createDoodle();

