const express = require("express");
const router = express.Router({
  mergeParams: true
});

const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");
let middleware = require("../middleware");

// Comments - New
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log("Error", err);
    } else {
      res.render("comments/new", {
        campground: campground
      });
    }
  });
});

//Comments - Create
router.post("/", middleware.isLoggedIn, (req, res) => {
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
          req.flash("success", "Comment added successfully.");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// Comment Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "No campground found");
        return res.redirect("back");
      }
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          console.log("Error", err);
          res.redirect("back");
        } else {
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
      });
    });
  });

// Comment Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        console.log("update success");
        res.redirect("/campgrounds/" + req.params.id);
      }
    }
  );
});

//Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment successfully deleted.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
