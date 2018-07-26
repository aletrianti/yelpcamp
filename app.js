// YelpCamp App
// The Web Developer Bootcamp by Colt Steele

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// Connect to db
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
/*
// Create campground
Campground.create({
    // Create a predefined campground
    name: "Sunset Valley", 
    image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?cs=srgb&dl=bonfire-camp-campfire-1061640.jpg&fm=jpg"
}, function(error, campground) {
    if (error) {
        console.log("Oops, something went wrong!");
        console.log(error);
    } else {
        console.log("A new camp was added");
        console.log(campground);
    }
});
*/

// Use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Recognise every page rendered as an ejs page
app.set("view engine", "ejs");


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
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

// Post a new campground
app.post("/campgrounds", function(req, res) {
    // Get info from the form in new.ejs and add the new camp to the array
    var name = req.body.name;
    var image = req.body.image;
    var newCamp = {name: name, image: image}

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
    res.render("new");
});

// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});