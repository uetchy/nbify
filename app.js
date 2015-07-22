var request = require('superagent');
var url = require('url');
var path = require('path');
var md2ipynb = require('md2ipynb');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));

function getMarkdownContent(urlString, callback) {
  console.log(urlString);
  request
    .get(urlString)
    .set('Accept', 'text/plain')
    .end(function(err, data){
      if ( err ) {
        callback(err, null);
        return;
      }
      var markdown = data.text;
      callback(null, markdown);
    });
}

app.get('/download/*', function(req, res) {
  getMarkdownContent(req.params[0], function(err, markdown) {
    res.type('text/plain');
    res.attachment(itemId + ".ipynb");
    res.send(md2ipynb(markdown));
  });
});

app.get('/*', function(req, res) {
  getMarkdownContent(req.params[0], function(err, markdown) {
    res.type('text/plain');
    res.send(md2ipynb(markdown));
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running http://localhost:' + app.get('port'));
});
