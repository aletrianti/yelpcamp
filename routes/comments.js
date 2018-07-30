var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campgrounds"),
    Comment = require("../models/comments");
    
// Create new comments
router.get("/new", isLoggedIn, function(req, res) {
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
router.post("/", isLoggedIn, function(req, res) {
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
                    // Add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    // Add comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
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