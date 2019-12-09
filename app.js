const express     = require('express'),
      app         = express(),
      PORT        = process.env.PORT || 3000,
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      Campground  = require("./models/campgrounds"),
      seedDb      = require("./seeds");

     

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

seedDb();

//Landing
app.get("/", (req, res) => {
    res.render("landing")
});

// Index
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {
                campgrounds: allCampgrounds
            }) // the key is the variable name, the value is the actual "allCampgrounds" data we're passing in 
        }
    })
});

// New
app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs")
});

// Show
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("show", {campground: foundCampground});
        }
})
});

app.post("/campgrounds", (req, res) => {
    // res.send("You hit the post route!");
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description
    let newCampground = {
        name: name,
        image: image,
        description: desc
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

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);

});