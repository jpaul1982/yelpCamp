const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

// Schema Setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

// Making model adds methods to schema
const Campground = mongoose.model("Campground", campgroundSchema);

Campground.create({
 name: "Pikes Place",
 image: "https://www.reserveamerica.com/webphotos/racms/articles/images/14b26607-aa0e-4bc9-8ab8-9e6cf80b3e26_image2_1-oregon.jpg"

}, (err, campground) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Newly Created Campground", );
        console.log(campground);
    }
});

app.get("/", (req, res) => {
    res.render("landing")
});

app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err) {
            console.log(err);
            
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds}) // the key is the variable name, the value is the actual "campgrounds" variable we're passing in 
        }
    })
    
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs")
})

app.post("/campgrounds", (req, res) => {
    // res.send("You hit the post route!");
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {
        name: name,
        image: image
    };
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);

});