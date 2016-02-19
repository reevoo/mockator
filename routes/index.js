var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();


router.get('/', function(req, res) {
  req.models.Page.find({}, function(err, pages) {
    res.render('index', { pages: pages });
  });
});


router.post('/scrape', function(req, res) {
  var url   = req.body.url;
  var pageArgs  = { url: url };

  request(url, function(err, response, html) {
    if (err) {
      res.send("Problem with requesting the page.");
      throw err;
    } else {
      pageArgs.html = html;
      var $ = cheerio.load(html);
      $('title').filter(function() {
        var element = $(this);
        pageArgs.title = element.text();
      });

      var page = new req.models.Page(pageArgs);
      page.save(function (err) {
        if (err) {
          res.send("There was a problem adding the information to the database.");
        } else {
          res.redirect('/');
        }
      });
    }
  })
});


module.exports = router;