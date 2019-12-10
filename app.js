const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000,
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campgrounds"),
    Comment = require("./models/comment"),
    seedDb = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user.js")


//  DataBase Config
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//  Body-Parser Config
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDb();

//===========================
//       Passport Config
//===========================

app.use(require("express-session")({
    secret: "Coffee is for closers.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    next();
})


//=========================
//     Index Routes
//=========================

//  Landing Page
app.get("/", (req, res) => {
    res.render("landing")
});

//  Index Page
app.get("/campgrounds", (req, res) => {
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

// New
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new.ejs")
});

//========================
//     Show Route
//========================


app.get("/campgrounds/:id", (req, res) => {
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

//=========================
//    Create Route
//=========================

app.post("/campgrounds", isLoggedIn, (req, res) => {
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

//==============================
//   Comments Route
//==============================

app.get("/campgrounds/:id/comments/new",isLoggedIn, (req, res) => {
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

app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log("Error", err);
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                console.log(req.body);

                if (err) {
                    console.log("Error", err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })

        }
    })
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", (req, res) => {
    res.render("register");
});

//handle sign up logic
app.post("/register", (req, res) => {
    let newUser = ({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                console.log("Error", err);
                return res.render("register")
            }
            passport.authenticate("local")(req, res, () => {
                res.redirect("/campgrounds");
            })
        }

    )
})

// show login form
app.get("/login", (req, res) => {
    res.render("login");
})

// handles login logic
app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {});

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};

app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);

});