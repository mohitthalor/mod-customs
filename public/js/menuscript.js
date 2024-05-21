// Get the current URL route
const currentRoute = window.location.pathname;

// Select all 'a' elements within the menu
const menuLinks = document.querySelectorAll('.menu-list a');

// Loop through each 'a' element
menuLinks.forEach(link => {
    // Get the href attribute of the 'a' element
    const href = link.getAttribute('href');

    // Check if the href matches the current route
    if (href === currentRoute) {
        // Add 'active' class to the 'li' child element if the href matches the current route
        link.querySelector('.menu').classList.add('active');
    }
});
