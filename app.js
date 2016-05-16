var request = require('superagent');
var path = require('path');
var md2ipynb = require('md2ipynb');
var express = require('express');
var app = express();

function getMarkdownContent(urlString, callback) {
  request
    .get(urlString)
    .set('Accept', 'text/plain')
    .end(function(err, data) {
      if (err) {
        callback(err, null);
        return;
      }
      var markdown = data.text;
      callback(null, markdown);
    });
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));

app.get('/download/*',
  function(req, res, next) {
    var markdownURL = req.params[0];
    getMarkdownContent(markdownURL, function(err, markdown) {
      if (err) return next(err);
      res.type('text/plain');
      res.attachment(path.basename(markdownURL) + ".ipynb");
      res.send(md2ipynb(markdown));
    });
  });

app.get('/*', function(req, res, next) {
  getMarkdownContent(req.params[0], function(err, markdown) {
    if (err) return next(err);
    res.type('text/plain');
    res.send(md2ipynb(markdown));
  });
});

app.use(function(err, req, res, next) {
  console.log(err);
  switch(err.code) {
    case 'ECONNREFUSED':
      res.send("Attempt to connect to the server was failed.");
      break;
    case 'ENOTFOUND':
      res.send("Requested URL is invalid Markdown file.");
      break;
    default:
      res.send(err.message);
  }

});

app.listen(app.get('port'), function() {
  console.log('Node app is running http://localhost:' + app.get('port'));
});
