const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware");


router
    .route("/account")
    .get(wrapAsync(userController.account));

router
    .route("/login")
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/account", failureFlash: true }), userController.login);


router
    .route("/signup")
    .post(saveRedirectUrl, wrapAsync(userController.signup));

router
    .route("/logout")
    .get(wrapAsync(userController.logout));

router
    .route("/:id/addToCart")
    .post(isLoggedIn, saveRedirectUrl, wrapAsync(userController.addToCart));

router
    .route("/cart")
    .get(isLoggedIn, saveRedirectUrl, wrapAsync(userController.cart));

router
    .route("/:productId/deleteFromCart")
    .post(isLoggedIn, saveRedirectUrl, wrapAsync(userController.deleteFromCart));

router
    .route("/buy")
    .get(isLoggedIn, saveRedirectUrl, wrapAsync(userController.buy));

router
    .route("/checkoutSuccess")
    .get(isLoggedIn, saveRedirectUrl, wrapAsync(userController.checkoutSuccess));

module.exports = router;
