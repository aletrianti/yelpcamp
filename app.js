// YelpCamp App
// The Web Developer Bootcamp by Colt Steele

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Recognise every page rendered as an ejs page
app.set("view engine", "ejs");

// Array of camps
var campgrounds = [
    {name: "Salmon Creek", image: "https://images.pexels.com/photos/111362/pexels-photo-111362.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name: "Granite Hill", image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
    {name: "Mountain Goat's Rest", image: "https://images.pexels.com/photos/290448/pexels-photo-290448.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"}
];


// Render landing page
app.get("/", function(req, res) {
    res.render("landing");
});

// Render campgrounds page and get info from the campgrounds array
app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

// Post a new campground
app.post("/campgrounds", function(req, res) {
    // Get info from the form in new.ejs and add the new camp to the array
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = {name: name, image: image}
    campgrounds.push(newCamp);

    // Redirect to this page (/campgrounds)
    res.redirect("/campgrounds");
});

// Render 'new campgrounds' page
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});