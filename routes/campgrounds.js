const express = require("express");
const router = express.Router();
const Campground = require("../models/campgrounds");
let middleware = require("../middleware");
let NodeGeocoder = require('node-geocoder');
 
let options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
let geocoder = NodeGeocoder(options);


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

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
          console.log(err.message);
          
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      let lat = data[0].latitude;
      let lng = data[0].longitude;
      let location = data[0].formattedAddress;
      let newCampground = {name: name, price: price, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err.message);
          } else {
              //redirect back to campgrounds page
              console.log("It worked!");
              
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });
  });

// New - show new form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
});

// Show - shows more info about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "campground not found");
            res.redirect("back")
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    })
});

// Edit Campground Site
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log("Error", err);
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            };
        });
    });

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });

// Destroy Campground

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {

        }
        res.redirect("/campgrounds")
    })
});


module.exports = router;