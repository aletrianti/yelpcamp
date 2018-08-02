// YelpCamp App
// The Web Developer Bootcamp by Colt Steele

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comments"),
    User = require("./models/users"),
    seedsDB = require("./seeds");

// Routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");

// Connect to db
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Recognise every page rendered as an ejs page
app.set("view engine", "ejs");

// Use CSS file in the public directory
app.use(express.static(__dirname + "/public"));

// Use method-override
app.use(methodOverride("_method"));

// Use connect-flash
app.use(flash());

// Call seedsDB() from seeds.js
// seedsDB();

// Passport config
app.use(require("express-session")({
    secret: "YelpCamp is awesome!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});