// Function to toggle the mobile navigation menu
function toggleMenu() {
    var menu = document.getElementById("mobile-menu");
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }
  
  // Function to update the active navigation link
  function updateActiveLink() {
    var navLinks = document.getElementsByClassName("nav-link");
    var currentPath = window.location.pathname;
    for (var i = 0; i < navLinks.length; i++) {
      var linkPath = navLinks[i].getAttribute("href");
      if (currentPath === linkPath) {
        navLinks[i].classList.add("active");
      } else {
        navLinks[i].classList.remove("active");
      }
    }
  }
  
  // Call the toggleMenu function when the mobile menu icon is clicked
  var menuIcon = document.getElementById("menu-icon");
  menuIcon.addEventListener("click", toggleMenu);
  
  // Call the updateActiveLink function on page load and on hashchange
  window.addEventListener("load", updateActiveLink);
  window.addEventListener("hashchange", updateActiveLink);
  
  // Function for EnterView animation
  function EnterView(target, offset) {
    var targetElement = document.querySelector(target);
  
    var elementHeight = targetElement.offsetHeight;
    var windowHeight = window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
  
    var targetPosition = targetElement.getBoundingClientRect().top + scrollY;
    var buffer = offset || 0;
  
    if (scrollY > targetPosition - windowHeight + buffer) {
      targetElement.classList.add("enter-view");
    }
  }
  
  // Call the EnterView function on scroll
  window.addEventListener("scroll", function () {
    EnterView("#EnterView");
  });
  