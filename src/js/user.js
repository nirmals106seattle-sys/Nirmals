document.addEventListener("DOMContentLoaded", function () {
  const menu = document.getElementById("menuTabs");
  let lastScrollY = window.scrollY;

  // Sticky menu on scroll
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      // Scrolling down
      menu.classList.add("sticky-menu");
    } else {
      // Scrolling up
      menu.classList.remove("hidden");
      menu.classList.add("sticky-menu");
    }

    if (currentScrollY === 0) {
      menu.classList.remove("sticky-menu");
    }

    lastScrollY = currentScrollY;
  });

  // Scroll-up button behavior
  document.querySelectorAll('.scroll-up-btn').forEach(link => {
    link.addEventListener('click', function (event) {
      if (this.getAttribute('href').startsWith('#')) {
        event.preventDefault();
      }

      const targetScroll = window.scrollY * 0.1;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
  });

  // Cocktail card flip behavior
  document.querySelectorAll('.cocktail-card').forEach(card => {
    card.addEventListener('click', () => {
      const inner = card.querySelector('.flip-inner');
      if (inner) {
        inner.classList.toggle('flipped');
      }
    });
  });

  // Scroll buttons
  const gallery = document.querySelector('.cocktail-gallery');
  if (gallery) {
    window.scrollLeft = function () {
      gallery.scrollBy({ left: -220, behavior: 'smooth' });
    };

    window.scrollRight = function () {
      gallery.scrollBy({ left: 220, behavior: 'smooth' });
    };
  }
});


