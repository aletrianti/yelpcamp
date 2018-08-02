// Middleware

var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
} 

middlewareObject.checkCampgroundOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(error, viewedCampground) {
            if (error) {
                console.log("Oops, something went wrong!");
                console.log(error);
                res.redirect("back");
            } else {
                // check if the author of the campground has the same id as the user
                if (viewedCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObject.checkCommentOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(error, viewedComment) {
            if (error) {
                console.log("Oops, something went wrong!");
                console.log(error);
                res.redirect("back");
            } else {
                // check if the author of the comment has the same id as the user
                if (viewedComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
} 

module.exports = middlewareObject;
