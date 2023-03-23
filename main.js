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
  