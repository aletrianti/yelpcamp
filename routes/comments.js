var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campgrounds"),
    Comment = require("../models/comments"),
    middleware = require("../middleware");
    
// Create new comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
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
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, campground) {
        if (error) {
            console.log("Oops, something went wrong!");
            res.redirect("/campgrounds");
        } else {
            // Add a new comment to db
            Comment.create(req.body.comment, function(error, comment) {
                if (error) {
                    console.log("Oops, something went wrong!");
                    req.flash("error", "Oops, something went wrong!");
                    console.log(error);
                } else {
                    // Add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    // Add comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(error, foundComment){
        if(error){
            res.redirect("back");
        } else {
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
     });
});

// Update comment
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
       if(error){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id );
       }
    });
});

// Destroy comment
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
       if(error){
            res.redirect("back");
       } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

module.exports = router;