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
app.get("/campgrounds/:id/comments/new", function(req, res) {
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
app.post("/campgrounds/:id/comments", function(req, res) {
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

// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});