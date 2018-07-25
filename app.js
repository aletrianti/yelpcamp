// YelpCamp App
// The Web Developer Bootcamp by Colt Steele

var express = require("express");
var app = express();

// app.set - ejs
app.set("view engine", "ejs");


// app.get - pages
app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    var campgrounds = [
        {name: "Salmon Creek", image: "https://images.pexels.com/photos/111362/pexels-photo-111362.jpeg?auto=compress&cs=tinysrgb&h=350"},
        {name: "Granite Hill", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
        {name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/290448/pexels-photo-290448.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
    ];
    res.render("campgrounds", {campgrounds: campgrounds});
});

// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});