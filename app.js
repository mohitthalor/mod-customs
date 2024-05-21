if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const menuRouter = require("./routes/menu");
const userRouter = require("./routes/user");
const sellerRouter = require("./routes/seller");
const searchedRouter = require("./routes/searched.js");
const reviewRouter = require("./routes/review.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const excellence = require("./models/excellence.js");
const Review = require("./models/review.js");
const mongoose = require("mongoose");
const wrapAsync = require("./utils/wrapAsync.js");
const { isLoggedIn, saveRedirectUrl } = require("./middleware");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const MongoStore = require('connect-mongo');



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mohitthalor13:ZTbw97DF9V5MYueE@cluster0.wwuywld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  mongoose.connect(uri);
  console.log("Database Connected");
}
run().catch(console.dir);


// Set up view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set flash messages and current user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

// Mount routes
app.use("/", menuRouter);
app.use("/", userRouter);
app.use("/", sellerRouter);
app.use("/", searchedRouter);
app.use("/", reviewRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});