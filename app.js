const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

let campgrounds = [{
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Wolf Ridge",
        image: "https://media2.fdncms.com/chronogram/imager/u/original/8615100/camping.jpg"
    },
    {
        name: "Pike Bend",
        image: "https://mitpress.mit.edu/sites/default/files/styles/full_text_column/public/2018-02/Environment_2.jpg?itok=l8Ta1sPu"
    },
    {
        name: "Goats Bed",
        image: "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fcdn-image.travelandleisure.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F1600x1000%2Fpublic%2F1443561122%2FCAMPING0915-Glacier-National-Park.jpg%3Fitok%3D6gQxpDuT&q=85"
    },
];
app.get("/", (req, res) => {
    res.render("landing")
});

app.get("/campgrounds", (req, res) => {


    res.render("campgrounds", {
        campgrounds: campgrounds
    }) // the key is the variable name, the value is the actual "campgrounds" variable we're passing in 
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