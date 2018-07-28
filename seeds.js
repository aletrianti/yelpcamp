var mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comments");
 
var data = [
    {
        name: "Sunset Valley", 
        image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?cs=srgb&dl=bonfire-camp-campfire-1061640.jpg&fm=jpg",
        description: "If you like sunsets and valleys, this is the perfect camp for you!"
    },
    {
        name: "Mountain Adventure", 
        image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?cs=srgb&dl=bonfire-camp-campfire-1061640.jpg&fm=jpg",
        description: "A place where you can only do one thing: relax."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Come visit Canyon Floor: you won't regret it!"
    }
]
 
function seedsDB(){
   //Remove all campgrounds
   Campground.remove({}, function(error){
        if(error){
            console.log(error);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(error) {
            if(error) {
                console.log(error);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed) {
                Campground.create(seed, function(error, campground) {
                    if(error) {
                        console.log(error)
                    } else {
                        console.log("added a campground");
                        // Create a comment
                        Comment.create({
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(error, comment){
                            if(error){
                                console.log(error);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        });
    }); 
}
 
module.exports = seedsDB;