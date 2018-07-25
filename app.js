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

// Start the server (http://localhost:3000) and create a callback function
app.listen(3000, function() {
    console.log("The server has started!");
});