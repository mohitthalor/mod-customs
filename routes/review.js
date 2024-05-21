const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { saveRedirectUrl } = require("../middleware");

const reviewController = require("../controllers/reviews.js");

// Create a new review
router.post("/:id/reviews", isLoggedIn, saveRedirectUrl, wrapAsync(reviewController.createReview));

// Delete a review
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, saveRedirectUrl, wrapAsync(reviewController.deleteReview));

module.exports = router;
