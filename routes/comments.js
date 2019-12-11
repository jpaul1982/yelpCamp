const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");

// Comments - New
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log("Error", err);

        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    })
});

//Comments - Create
router.post("/", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log("Error", err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                console.log(req.body);

                if (err) {
                    console.log("Error", err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
});



// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};

module.exports = router;