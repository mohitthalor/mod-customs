const flash = require("flash");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Excellence = require("../models/excellence.js");



module.exports.dashboard = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./seller/dashboard.ejs", { allListings });
}

module.exports.previousWork = async (req, res) => {
    res.render("./seller/previousWork.ejs");
}

module.exports.previousWorkUpload = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    if (!req.body.excellence) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    const newExcellence = new Excellence(req.body.excellence);

    newExcellence.image = { url, filename };
    await newExcellence.save();
    req.flash("success", "New Works Image is Uploaded!");
    res.redirect("/seller");
}

module.exports.createPage = (req, res) => {
    res.render("./seller/createPage.ejs");
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listings is Created!");
    res.redirect("/seller");

};

module.exports.editPage = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "This listing does not exist!");
        res.redirect("/seller");
    }
    res.render("./seller/editPage.ejs", { listing });
}


module.exports.updateListing = async (req, res, next) => {

    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    let { id } = req.params;
    const currUser = req.user;
    let listing = await Listing.findById(id);
    if (!currUser._id.equals(listing.owner._id)) {
        req.flash("error", "you don't have permission to edit this listing!");
        res.redirect('/seller');
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();

    }

    req.flash("success", "Listings is Updated!");
    res.redirect('/seller');
};


module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id); // Corrected line
    req.flash("success", "Listing is Deleted!");
    res.redirect("/seller");
};
