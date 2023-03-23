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

window.onload = function() {
    document.getElementById("EnterView").onclick = function() {
      window.location.href = "#AboutMe";
    }
  };
  
  
  document.addEventListener("DOMContentLoaded", function() {
    var navLinks = document.querySelectorAll(".nav-link");
    var navItems = document.querySelectorAll(".nav-item");
    
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener("click", function(e) {
        e.preventDefault();
        var target = this.getAttribute("href");
        var targetElement = document.querySelector(target);
        
        for (var j = 0; j < navItems.length; j++) {
          navItems[j].classList.remove("active");
        }
        
        this.parentElement.classList.add("active");
        targetElement.scrollIntoView({ behavior: "smooth" });
      });
    }
  });
  