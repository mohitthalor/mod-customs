const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require('../utils/ExpressError');
const flash = require("flash");
const reviewCooldownHours = 24; // Set the cooldown period in hours


module.exports.createReview = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('reviews');
        if (!listing) {
            req.flash("error","Listing not found");
            res.redirect(`/${listing._id}/showListing`);

        }

        const listingOwner = listing.owner.toString();
        if (listingOwner === req.user._id.toString()) {
            req.flash("error","You can't review your own listing");
            return res.redirect(`/${listing._id}/showListing`);

        }


        const existingReview = await Review.findOne({ author: req.user._id }).sort({ createdAt: -1 });
        if (existingReview) {
            const now = new Date();
            const lastReviewTime = new Date(existingReview.createdAt);
            const hoursSinceLastReview = (now - lastReviewTime) / 1000 / 60 / 60;
            
            if (hoursSinceLastReview < reviewCooldownHours) {
                req.flash("error",`You can only review once every ${reviewCooldownHours} hours.`);
                return res.redirect(`/${listing._id}/showListing`);
            }
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "Review is created!");
        res.redirect(`/${listing._id}/showListing`);
    } catch (error) {
        next(error);
    }
};


module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/${id}/showListing`);
};