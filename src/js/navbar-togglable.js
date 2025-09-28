//
// navbar.js
//

const navbar = document.querySelector('.navbar-togglable');
const navbarCollapse = document.querySelector('.navbar-collapse');
const windowEvents = ['load', 'scroll'];

let isLight = false;
let isCollapsed = false;

function makeNavbarDark(navbar) {
  navbar.classList.add('navbar-dark');
  isLight = false;
}

function makeNavbarLight(navbar) {
  navbar.classList.remove('navbar-dark');
  isLight = true;
}

function toggleNavbar(navbar) {
  const scrollTop = window.pageYOffset;

  if (scrollTop && !isLight) {
    makeNavbarLight(navbar);
  }

  if (!scrollTop && !isCollapsed) {
    makeNavbarDark(navbar);
  }
}

if (navbar) {
  // Toggle navbar on scroll
  windowEvents.forEach(function (event) {
    window.addEventListener(event, function () {
      toggleNavbar(navbar);
    });
  });

  // Toggle navbar on expand
  navbarCollapse.addEventListener('show.bs.collapse', function () {
    isCollapsed = true;

    makeNavbarLight(navbar);
  });

  // Toggle navbar on collapse
  navbarCollapse.addEventListener('hidden.bs.collapse', function () {
    isCollapsed = false;

    if (!window.pageYOffset) {
      makeNavbarDark(navbar);
    }
  });
}

// Automatically set the current date in YYYY-MM-DD format
document.addEventListener('DOMContentLoaded', function () {
  const dateInput = document.getElementById('date');
  
  // Check if the dateInput element exists before trying to set its value
  if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.value = today;
  } else {
      console.log("Date input element not found. Skipping date value assignment.");
  }
});



