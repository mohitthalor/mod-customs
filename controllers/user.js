const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Listing = require('../models/listing');
const User = require('../models/user');
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, saveRedirectUrl } = require("../middleware");
const cartItem = require('../models/cartItem');


module.exports.account = (req, res) => {
    res.render("./users/loginSignup.ejs");
}

module.exports.login = (req, res, next) => {
    // Assuming you're using passport.authenticate middleware to handle authentication
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/account");
        }
        req.logIn(user, err => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Mod Customs " + user.username);
            res.redirect(res.locals.redirectUrl);
        });
    })(req, res, next);
}


module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Mod Customs " + username);
            res.redirect(res.locals.redirectUrl);
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/account");
    }
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully Logged Out");
        res.redirect("/");
    })
}

module.exports.addToCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;
        const product = await Listing.findById(productId);

        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/');
        }

        let user = await User.findById(userId).populate('cart');

        if (!user.cart) {
            const cart = new Cart({ user: userId });
            await cart.save();
            user.cart = cart._id;
            await user.save();
        }

        let cart = await Cart.findById(user.cart).populate('items');

        let cartItem = cart.items.find(item => item.product.toString() === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cartItem = new CartItem({
                user: userId,
                product: productId,
                quantity: 1,
                price: product.price
            });
            await cartItem.save();
            cart.items.push(cartItem);
        }

        cart.totalPrice += product.price;
        await cart.save();

        req.flash('success', 'Added to Cart');
        res.redirect('/cart');
    } catch (err) {
        next(err);
    }
};


module.exports.deleteFromCart = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const userId = req.user._id;

        // Find the user's cart
        const user = await User.findById(userId).populate('cart');
        const cart = user.cart;

        // Find the cart item corresponding to the product to be deleted
        const cartItem = await CartItem.findOneAndDelete({ product: productId, user: userId });

        // Remove the cart item reference from the cart
        cart.items.pull(cartItem._id);

        // Update the total price of the cart
        cart.totalPrice -= cartItem.price * cartItem.quantity;

        // Save the changes
        await cart.save();

        req.flash('success', 'Product removed from cart');
        res.redirect('/cart');
    } catch (err) {
        next(err);
    }
};

module.exports.cart = async (req, res, next) => {
    try {

        const user = await User.findById(req.user._id).populate({
            path: 'cart',
            populate: {
                path: 'items',
                populate: {
                    path: 'product'
                }
            }
        });
        const cart = user.cart;
        res.render("./users/cart.ejs", { cart });
    } catch (err) {
        req.flash('error', "nothing is in cart");
        res.redirect('/');
    }
}


module.exports.buy = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).populate({
            path: 'cart',
            populate: {
                path: 'items',
                populate: {
                    path: 'product'
                }
            }
        });
        const cart = user.cart;
        res.render("./users/buy.ejs", { cart });
    } catch (err) {
        req.flash('error', "nothing is in cart");
        res.redirect('/');
    }

}

module.exports.checkoutSuccess = async (req, res) => {
    res.render("./users/checkoutSuccess.ejs");
}