const flash = require("flash");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Excellence = require("../models/excellence.js");

module.exports.home = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./menu/home.ejs", { allListings });
}

module.exports.excellence = async(req, res) => {
    const allExcellence = await Excellence.find({});
    res.render("./menu/excellence.ejs",{allExcellence});

}

module.exports.FAQ = (req, res) => {
    res.render("./menu/FAQ.ejs");

}

module.exports.about = (req, res) => {
    res.render("./menu/about.ejs");

}

