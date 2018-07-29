// YelpCamp App
// The Web Developer Bootcamp by Colt Steele

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comments"),
    User = require("./models/users"),
    seedsDB = require("./seeds");

// Connect to db
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Recognise every page rendered as an ejs page
app.set("view engine", "ejs");

// Use CSS file in the public directory
app.use(express.static(__dirname + "/public"));

// Call seedsDB() from seeds.js
seedsDB();

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
    next();
});


// Render landing page
app.get("/", function(req, res) {
    res.render("landing");
});

// Render campgrounds page and get info from the campgrounds array
app.get("/campgrounds", function(req, res) {
    // Retrieve campgrounds
    Campground.find({}, function(error, allCampgrounds) {
        if (error) {
            console.log("Oops, something went wrong!");
            console.log(error);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// Post a new campground
app.post("/campgrounds", function(req, res) {
    // Get info from the form in campgrounds/new.ejs and add the new camp to the array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCamp = {name: name, image: image, description: description};

    // Add a new campground to db
    Campground.create(newCamp, function(error, newlyCreated) {
        if (error) {
            console.log("Oops, something went wrong!");
            console.log(error);
        } else {
            // Redirect to this page (/campgrounds)
            res.redirect("/campgrounds");
        }
    });
});

// Render 'new campgrounds' page
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// Show info about a campground
app.get("/campgrounds/:id", function(req, res) {
    // Find campground with its id
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
        if (error) {
            console.log("Oops, something went wrong!");
            console.log(error);
        } else {
            // Render show template with the campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Create new comments
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    // Find campground with its id
    Campground.findById(req.params.id, function(error, campground) {
        if (error) {
            console.log("Oops, something went wrong!");
            console.log(error);
        } else {
            // Render show template with the campground
            res.render("comments/new", {campground: campground});
        }
    });
});

// Post the new comment
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        if (error) {
            console.log("Oops, something went wrong!");
            res.redirect("/campgrounds");
        } else {
            // Add a new comment to db
            Comment.create(req.body.comment, function(error, comment) {
                if (error) {
                    console.log("Oops, something went wrong!");
                    console.log(error);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Auth routes

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(error, user) {
        if (error) {
            console.log(error);
            return res.render("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});
                
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}



// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});