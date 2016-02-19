var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var urlLib  = require('url');
var router  = express.Router();


router.get('/', function(req, res) {
  req.models.Page.find({}, function(err, pages) {
    res.render('index', { pages: pages });
  });
});


router.post('/mockator/scrape', function(req, res) {
  var url   = req.body.url;
  var pageArgs  = { url: url };

  request(url, function(err, response, body) {
    if (err) {
      res.send("Problem with requesting the page.");
      throw err;
    } else {
      var $ = cheerio.load(body);
      $('body').append('<script src="/mockator/js/mockator.js"></script>');
      pageArgs.title = $('title').text();
      pageArgs.html = $.html();

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


router.get('/mockator/pages/:id', function(req, res) {
  req.models.Page.findOne({ _id: req.params.id }, function(err, page) {
    res.cookie('pageUrl', page.url);
    res.send(page.html);
  });
});


router.get('/*', function(req, res) {
  var absoluteUrl = urlLib.resolve(req.cookies.pageUrl, req.originalUrl);
  request(absoluteUrl).pipe(res);
});


module.exports = router;
