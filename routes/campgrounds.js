var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campgrounds");

// Render campgrounds page and get info from the campgrounds array
router.get("/", function(req, res) {
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
router.post("/", isLoggedIn, function(req, res) {
    // Get info from the form in campgrounds/new.ejs and add the new camp to the array
    var name = req.body.name,
        image = req.body.image,
        description = req.body.description,
        author = {
            id: req.user._id,
            username: req.user.username
        }
        newCamp = {name: name, image: image, description: description, author: author};

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
router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// Show info about a campground
router.get("/:id", function(req, res) {
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

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;