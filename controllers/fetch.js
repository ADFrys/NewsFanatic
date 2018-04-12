var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Headline = require("../models/Headline.js");
var index = require("../models/index.js");
var axios = require("axios");


  module.exports = function(app) {
    var finalResults = [];

  app.get("/", function (req, res) {
    Headline.find({}, function (error, data) {
      if (error) {
        console.log(error);
      } else {
        res.render("index", { result: data });
      }
    })
  });

  app.get("/headlines", function (req, res) {
    Headline.find({}, function (error, data) {
      if (error) {
        console.log(error);
      } else {
        res.json(data);
        }
      })
    });


app.get("/scrape", function(req, res) {

  axios.get("https://www.newyorker.com/news").then(function (response) {

    var $ = cheerio.load(response.data);
    $(".Card__dekImageContainer___3CRKY").each(function(i, element) {
      var result = {};

      result.title = $(this)
      .children("p")
      .text();
      result.url = $(this)
      .children("a")
      .attr("href");

      finalResults.push(result);
  });

    Headline.create(finalResults)
    .then(function (dbHeadline) {
      res.json({msg: "Scrape has completed"});
      })
    .catch(function (err) {
      console.log(err);
      })
    });
  }); 

app.post("/notes", function(req, res) {
  // Create a new Note in the db
  Note.create(req.body)
    .then(function(dbNote) {
      return Headline.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbHeadline) {
      // If the User was updated successfully, send it back to the client
      res.json(dbHeadline);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});


app.get("/notes", function(req, res) {

  Headline.find({})

    .populate("notes")
    .then(function(dbnotes) {

      res.json(dbnotes);
    })
    .catch(function(err) {

      res.json(err);
    });
});


};



