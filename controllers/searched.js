const flash = require("flash");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

module.exports.searchedContent = async (req, res, next) => {

    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        // If the listing doesn't exist, redirect with an error flash message
        if (!listing) {
            req.flash("error", "This listing does not exist!");
            return res.redirect("/seller");
        }

        // Get company, model, and type of the listing
        const { company, model, type } = listing;

        // Find all listings with the same company, model, and type
        let similarListings = await Listing.find({
            company: company,
            model: model,
            type: type,

        });

        res.render("./searched/searchedContentPage.ejs", { listing, similarListings });

    } catch (error) {
        // Handle errors
        console.error("Error in showListing:", error);
        req.flash("error", "An error occurred while fetching the listing.");
        res.redirect("/seller");
    }


};


module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");

    if (!listing) {
        req.flash("error", "This listing does not exist!");
        return res.redirect("/seller");
    }

    // Get company, model, and type of the listing
    const { company, model, type } = listing;

    // Find all listings with the same company, model, and type
    let similarListings = await Listing.find({
        company: company,
        model: model,
        type: type,
        _id: { $ne: id }
    });

    res.render("./searched/show.ejs", { listing, similarListings });
};
