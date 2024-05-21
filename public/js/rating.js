// Select all elements with class "each-review"
const reviewElements = document.querySelectorAll('.each-review');

// Loop through each review element
reviewElements.forEach(reviewElement => {
    // Extract the rating from the review element's text content
    const ratingElement = reviewElement.querySelector('.rating-stars');
    const rating = parseInt(ratingElement.textContent.trim());

    // Create a string of star signs based on the rating
    const starSigns = '★'.repeat(rating);

    // Print the star signs next to the rating element
    ratingElement.insertAdjacentHTML('beforeend', starSigns);
});
