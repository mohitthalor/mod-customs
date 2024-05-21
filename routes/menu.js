const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

router
    .route("/")
    .get(wrapAsync(menuController.home));



router
    .route("/excellence")
    .get(wrapAsync(menuController.excellence));

router
    .route("/FAQ")
    .get(wrapAsync(menuController.FAQ));

router
    .route("/about")
    .get(wrapAsync(menuController.about));

module.exports = router;
