var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Headline = require("../models/Headline.js");
var index = require("../models/index.js");
var axios = require("axios");


module.exports = function(app) {

  // finalResults array will store the scraped headlines and links.
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

//FYI - the scrape works the first time around, but since the models are set to be unique for headline and link, 
// it throws an error when you click scrape again (due to duplicate articles). I'm not sure what is the best practice for this scenerio
  app.get("/scrape", function(req, res) {

  axios.get("https://www.newyorker.com/news").then(function (response) {

  var $ = cheerio.load(response.data);
  $(".Card__dekImageContainer___3CRKY").each(function(i, element) {
    // Save scraped results into an object that will be pushed into the finalResults array.
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

// This currently does not work. Tried to adopt this from a previous activity
  app.get("/headlines/:id", function(req, res) {

  db.Headline.findOne({ _id: req.params.id })
   
    .populate("notes")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// This currently does not work as well. 
app.post("/headlines/:id", function(req, res) {
  Note.create(req.body)
    .then(function(dbNote) {
      return db.Headline.findOneAndUpdate({ _id: req.params.id }, { notes: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

};



