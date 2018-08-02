var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/users");
    
// Render landing page
router.get("/", function(req, res) {
    res.render("landing");
});

// Auth routes

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(error, user) {
        if (error) {
            console.log(error);
            req.flash("error", error.message);
            return res.render("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome to YelpCamp " + user.username + "!");
                res.redirect("/campgrounds");
            });
        }
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});
                
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You've been logged out! Bye!")
    res.redirect("/campgrounds");
});

module.exports = router;