const express = require("express");
const router = express.Router();
const Campground = require("../models/campgrounds");


// Index - show all campgrounds
router.get("/", (req, res) => {
    console.log(req.user);
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            }); // the key is the variable name, the value is the actual "allCampgrounds" data we're passing in 
        }
    })
});

// Create - add new campground to DB
router.post("/", isLoggedIn, (req, res) => {
    // res.send("You hit the post route!");
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author,
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Newly Created Campground", );
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
});

// New - show new form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
});

// Show - shows more info about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    })
});

// Edit Campground Site
router.get("/:id/edit", (req, res) => {
    if(req.isAuthenticated()){

    } else {
        console.log("You need to be logged in ");
        
    }
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log("Error", err);
            res.redirect("/campgrounds")
        } else {
            res.render("campgrounds/edit", {
                campground: foundCampground
            });
        }
    })
});

// Update Campground Site
router.put("/:id", (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        console.log(req.body.id);

        if (err) {
            console.log("Error", err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// Destroy Campground

router.delete("/:id", (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err)=> {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {

        }
        res.redirect("/campgrounds")
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};

module.exports = router;