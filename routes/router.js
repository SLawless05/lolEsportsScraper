// Dependencies
var express = require("express");
var router = express.Router();

// *** Scraping Tools *** //
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// *** Route for Scraping *** //
router.get("/scrape", function (req, res) {
    axios.get("hhttps://old.reddit.com/r/lolesports/")
        .then(function (response) {
            var $ = cheerio.load(response.data);

            $("p.title").each(function (i, element) {

                var result = {};

                result.title = $(element).text();

                result.link = $(element).children().attr("href");

                db.Article.create(result)
                    .then(function (dbArticle) {
                    })
                    .catch(function (error) {
                        return res.json(error);
                    });
            });

            res.send("Scrape was successful!");
        });
});

// *** Routes to export to server.js *** //

// Route to get all Articles from the db.
router.get("/", function (req, res) {
    db.Article.find({}).limit(20)
        .then(function (scrapedData) {
            var hbsObject = { articles: scrapedData };
            console.log(hbsObject);
            res.render("index", hbsObject);
        })
        .catch(function (error) {
            res.json(error);
        });
});

// Route to save an Article.
router.put("/saved/:id", function (req, res) {
    db.Article.update(
        { _id: req.params.id },
        { saved: true }
    )
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json(error);
        });
});

// Route to drop the Articles collection.
router.delete("/drop-articles", function (req, res, next) {
    db.Article.remove({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("articles dropped!");
        }
    })
        .then(function (dropnotes) {
            db.Note.remove({}, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("notes dropped!");
                }
            })
        })
});

module.exports = router;