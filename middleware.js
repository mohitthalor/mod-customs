const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to do that!");
        return res.redirect('/account');
    }
    next();

};

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session && req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    } else {
        res.locals.redirectUrl = '/';
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
        
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/${id}/showListing`);
        }

        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You do not have permission to do that!");
            return res.redirect(`/${id}/showListing`);
        }

        next();
    } catch (err) {
        console.error("Error in isReviewAuthor middleware:", err);
        req.flash("error", "Something went wrong!");
        return res.redirect(`/${id}/showListing`);
    }
};
