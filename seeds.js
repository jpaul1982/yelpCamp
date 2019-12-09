const mongoose = require("mongoose");
const Campground = require("./models/campgrounds");
const Comment = require("./models/comments")

const data = [{
        name: "Clouds Rest",
        image: "https://images.unsplash.com/photo-1571993004081-fa706d434118?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=802&q=80",
        description: "Palace in the sky."
    },
    {
        name: "Mages Lair",
        image: "https://images.unsplash.com/photo-1574170240473-5733a5b43a3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
        description: "Dwell in this mossy escape."
    },
    {
        name: "Boring Room",
        image: "https://images.unsplash.com/photo-1558682550-4275be645064?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80",
        description: "Modern garbage blah blah blah."
    },
];


function seedDb() {
    //Remove all campgrounds.
    Campground.deleteMany({}, (err) => {
        if (err) {
            console.log("Error", err);

        } else {
            console.log("Campgrounds Removed");
            // add campgrounds
            data.forEach((seed) => {
                Campground.create((seed), (err, campground) => {
                    if (err) {
                        console.log("Error", err);

                    } else {
                        console.log("Added a campground.");
                        // create comment on each
                        Comment.create({
                            text: "This place was amazing!!  Highly reccomend for those who live to soar.",
                            author: "Hiildan the Blue"
                        }, (err, comment) => {
                            if (err) {
                                console.log("Error", err);

                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("New Comment Created.");

                            }

                        });

                    }
                });
            });

        }
    });




};

module.exports = seedDb;