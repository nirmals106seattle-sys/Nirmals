document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("book-table-btn"); 
    const cateringButton = document.getElementById("catering-btn");
    const cateringSection = document.querySelector(".slider");
    let lastScrollY =  0;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY; // Get the current scroll position

        // Detect scrolling direction
        lastScrollY = currentScrollY;

        // Detect when the slider section (catering section) is in view
        var rect = cateringSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          // Section is in view, show the Catering button
          button.style.display = "none";  // Hide Book A Table button
          cateringButton.style.display = "block";  // Show Catering button
        } 
        else {
          cateringButton.style.display = "none";
          if (currentScrollY > lastScrollY) {
            // Scrolling down - keep "Book A Table" button visible
            button.style.display = "block";
            
          } else {
              // Scrolling up - keep "Book A Table" button visible
              button.style.display = "block";
          }

          // Hide the "Book A Table" button when at the top of the page
          if (currentScrollY === 0) { 
                button.style.display = "none";  // Hide button when at the top
                button.classList.remove("book-table-btn"); // Remove sticky class
            } 
        }
    });
});