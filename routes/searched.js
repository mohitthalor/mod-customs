const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searched.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

router
    .route("/:id/searchedContent")
    .get(wrapAsync(searchController.searchedContent));

router
    .route("/:id/showListing")
    .get(wrapAsync(searchController.showListing));

module.exports = router;
