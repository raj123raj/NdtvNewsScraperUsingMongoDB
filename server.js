// require dependencies
//Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
var express = require("express");
//To communicate with mongodb
var mongoose = require("mongoose");
//As we need to call ndtv website and access the urls, it is a HTTP request
var request = require("request");
//Cheerio parses markup and provides an API for traversing/manipulating the resulting data structure
var cheerio = require("cheerio");
//Node.js body parsing middleware.
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
//WE can explicitly set the port number provided no other instances running on that port
var PORT = process.env.PORT || 3000;

// initialize Express
var app = express();

// use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: false
}));
// We are getting the output in the form of application/json
app.use(bodyParser.json({
  type: "application/json"
}));

// serve the public directory
app.use(express.static("public"));

// use promises with Mongo and connect to the database
//Let us have our mongodb database name to be ndtvnews
//By using Promise, Mongoose async operations, like .save() and queries, return thenables. 
mongoose.Promise = Promise; 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ndtvnews";
mongoose.connect(MONGODB_URI);

// use handlebars
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Hook mongojs configuration to the db variable
var db = require("./models");

// We need to filter out NdtvArticles from the database that are not saved
// It will be called on startup of url
app.get("/", function(req, res) {
  
  db.Article.find({
      saved: false
    },

    function(error, dbArticle) {
      if (error) {
        console.log(error);
      } else {
        //We are passing the contents to index.handlebars
        res.render("index", {
          articles: dbArticle
        });
      }
    })
})

// use cheerio to scrape stories from NDTV and store them
//We need to do this on one time basis each day
app.get("/scrape", function(req, res) {
    request("https://ndtv.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    //By inspecting the web page we know how to get the title i.e. headlines of news.
    //From view page source also we can able to get it. It differs in each web page
    $("h2").each(function(i, element) {
      // trim() removes whitespace because the items return \n and \t before and after the text
      var title = $(element).find("a").text().trim();
      console.log("title",title);
      var link = $(element).find("a").attr("href");
      console.log("link",link);

      // if these are present in the scraped data, create an article in the database collection
       if (title && link ) {
        db.Article.create({
            title: title,
            link: link
          },
          function(err, inserted) {
            if (err) {
              // log the error if one is encountered during the query
              console.log(err);
            } else {
              // otherwise, log the inserted data
              console.log(inserted);
            }
          });
        // if there are 10 articles, then return the callback to the frontend
        console.log(i);
        if (i === 10) {
          return res.sendStatus(200);
        }
      } 
    });
  });
});

// route for retrieving all the saved articles. User has the option to save the article.
//Once it is saved, "saved" column in the collection is set to true. Below routine helps to find the articles that are saved
app.get("/saved", function(req, res) {
  db.Article.find({
      saved: true
    })
    .then(function(dbArticle) {
      // if successful, then render with the handlebars saved page
      // this time saved.handlebars is called and that page is rendered
      res.render("saved", {
        articles: dbArticle
      })
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    })

});

// route for setting an article to saved
// In order to save an article, this routine is used.
//_id column in collection is unique and it will determine the uniqueness of the news
app.put("/saved/:id", function(req, res) {
  db.Article.findByIdAndUpdate(
      req.params.id, {
        $set: req.body
      }, {
        new: true
      })
    .then(function(dbArticle) {
      // this time saved.handlebars is called and that page is rendered
      res.render("saved", {
        articles: dbArticle
      })
    })
    .catch(function(err) {
      res.json(err);
    });
});

// route for saving a new note to the db and associating it with an article
app.post("/submit/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      var articleIdFromString = mongoose.Types.ObjectId(req.params.id)
      return db.Article.findByIdAndUpdate(articleIdFromString, {
        $push: {
          notes: dbNote._id
        }
      })
    })
    .then(function(dbArticle) {
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// route to find a note by ID
app.get("/notes/article/:id", function(req, res) {
  db.Article.findOne({"_id":req.params.id})
    .populate("notes")
    .exec (function (error, data) {
        if (error) {
            console.log(error);
        } else {
          res.json(data);
        }
    });        
});


app.get("/notes/:id", function(req, res) {

  db.Note.findOneAndRemove({_id:req.params.id}, function (error, data) {
      if (error) {
          console.log(error);
      } else {
      }
      res.json(data);
  });
});

// listen for the routes
app.listen(PORT, function() {
  console.log("App is running");
});