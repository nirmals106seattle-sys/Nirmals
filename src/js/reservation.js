document.querySelectorAll('.scrolldown').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default anchor behavior

        // Target the element with the ID 'menuContent'
        const targetElement = document.getElementById('menuContent');

        if (targetElement) {
            // Calculate the position of the target element
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

            // Optional: Adjust for fixed header height or offsets
            const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const finalScrollPosition = targetPosition - headerHeight;

            // Smooth scroll to the adjusted position
            window.scrollTo({
                top: finalScrollPosition,
                behavior: 'smooth'
            });
        }
    });
});

