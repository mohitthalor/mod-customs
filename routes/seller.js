const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, saveRedirectUrl } = require("../middleware");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const excellence = require("../models/excellence.js");



const sellerController = require("../controllers/seller.js");

router
    .route("/seller")
    .get(isLoggedIn, saveRedirectUrl, wrapAsync(sellerController.dashboard));

router
    .route("/previousWork")
    .get(isLoggedIn, saveRedirectUrl, wrapAsync(sellerController.previousWork))

router
    .route("/previousWorkUpload")
    .post(isLoggedIn, saveRedirectUrl, upload.single('excellence[image]'), wrapAsync(sellerController.previousWorkUpload));

router
    .route("/createPage")
    .get(isLoggedIn, saveRedirectUrl, wrapAsync(sellerController.createPage));

router
    .route("/createListing")
    .post(isLoggedIn, saveRedirectUrl, upload.single('listing[image]'), wrapAsync(sellerController.createListing));


router
    .route("/:id/updateListing")
    .put(isLoggedIn, saveRedirectUrl, upload.single('listing[image]'), wrapAsync(sellerController.updateListing));


router
    .route("/:id/editPage")
    .get(isLoggedIn, saveRedirectUrl, wrapAsync(sellerController.editPage));

router
    .route("/:id/deleteListing")
    .delete(isLoggedIn, saveRedirectUrl, wrapAsync(sellerController.deleteListing));


module.exports = router;