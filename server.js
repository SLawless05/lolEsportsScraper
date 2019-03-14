// *** Dependencies *** //
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");

// *** Database setup *** //
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articleScraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var app = express();

app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse application/json
app.use(bodyParser.json());

//get public static
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Import and use routes.
var scraperRoutes = require("./routes/router.js");
var savedRoutes = require("./routes/saved-article-router.js");
app.use(scraperRoutes, savedRoutes);

// Start the Server
var PORT = process.env.PORT || 5420;
app.listen(PORT, function () {
    console.log("App running http://localhost:" + PORT + "/");
});