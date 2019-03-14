// Dependencies
var express = require("express");
var router = express.Router();

// Require all models
var db = require("../models");

// Route to get all saved Articles from the db.
router.get("/saved-articles", function (req, res) {

    db.Article.find({})
        .then(function (savedData) {
            var hbsObject = { articles: savedData };
            res.render("saved", hbsObject);
        })
        .catch(function (error) {
            res.json(error);
        });
});

router.get("/getnotes/:id", function (req, res) {
    db.Article.findOne(
        { _id: req.params.id }
    )
        .populate("notes")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (error) {
            res.json(error);
        });
});

// Route for saving/updating an Article's associated Note.
router.post("/postnotes/:id", function (req, res) {
    console.log(req.body);
    console.log("xxxxxxx");
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $push:
                        { notes: dbNote._id }
                },
                { new: true }
            );
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (error) {
            res.json(error);
        });
});

// Route for updating a Note.
router.get("/getsinglenote/:id", function (req, res) {
    db.Note.findOne(
        { _id: req.params.id }
    )
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json(error);
        });
});

// Route to delete a Note.
router.delete("/deletenote/:id", function (req, res) {
    db.Note.remove(
        { _id: req.params.id }
    )
        .then(function (dbNote) {
            res.json(dbNote);
        })
        .catch(function (error) {
            res.json(error);
        });
});

// Route to return (unsave) an Article.
router.put("/returned/:id", function (req, res) {
    db.Article.update(
        { _id: req.params.id },
        { saved: false }
    )
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json(error);
        });
});

module.exports = router;