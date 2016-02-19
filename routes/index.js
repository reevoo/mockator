var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var urlLib  = require('url');
var webshot = require('webshot');
var fs      = require('fs');
var path    = require('path');
var mongoose = require('mongoose');
var router  = express.Router();



function screenshotPath(id) {
  return path.resolve('./public/mockator/page-screenshots/' + id + '.png');
}


router.get('/', function(req, res) {
  req.models.Page.find({}, function(err, pages) {
    res.render('index', { pages: pages });
  });
});


router.post('/mockator/scrape', function(req, res) {
  var url = req.body.url;
  var id = mongoose.Types.ObjectId();
  var pageArgs = { _id: id, url: url };

  request(url, function(err, response, body) {
    if (err) {
      res.send("Problem with requesting the page.");
      throw err;
    } else {
      var $ = cheerio.load(body);
      pageArgs.title = $('title').text();
      pageArgs.html = $.html();

      var page = new req.models.Page(pageArgs);
      page.save(function (err) {
        if (err) {
          res.send("There was a problem adding the information to the database.");
        } else {
          webshot(url, screenshotPath(page.id), function(err) {
            res.redirect('/');
          });
        }
      });
    }
  })
});


router.get('/mockator/pages/:id', function(req, res) {
  req.models.Page.findOne({ _id: req.params.id }, function(err, page) {
    res.cookie('pageUrl', page.url);
    var $ = cheerio.load(page.html);
    $('body').append('<script id="mockator-script" src="/mockator/js/mockator.js"></script>');
    res.send($.html());
  });
});


router.put('/mockator/pages/:id/html', function(req, res) {
  var $ = cheerio.load(req.body);
  $('#mockator-script').remove();
  req.models.Page.findOneAndUpdate({ _id: req.params.id }, { html: $.html() }, function(err, page) {
    res.redirect('/');
  });
});


router.delete('/mockator/pages/:id', function(req, res) {
  req.models.Page.remove({ _id: req.params.id }, function(err) {
    res.redirect('/');
    try {
      fs.unlink(screenshotPath(req.params.id));
    } catch(err) {
      // ignore for now
    }
  });
});


router.get('/*', function(req, res) {
  var absoluteUrl = urlLib.resolve(req.cookies.pageUrl, req.originalUrl);
  request(absoluteUrl).pipe(res);
});


module.exports = router;
