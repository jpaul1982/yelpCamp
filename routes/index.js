const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Root Route
router.get("/", (req, res) => {
    res.render("landing")
});

// Show Register Form
router.get("/register", (req, res) => {
    res.render("register");
});

// Handles Sign-up Logic
router.post("/register", (req, res) => {
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
    })
})

// Show Login Form
router.get("/login", (req, res) => {
    res.render("login");
})

// Handles Login Logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {});

// Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
};

module.exports = router;