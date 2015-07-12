var request = require('superagent');
var url = require('url');
var path = require('path');
var md2ipynb = require('md2ipynb');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/*', function(req, response) {
  var targetUrl = url.parse(req.params[0]);
  switch(targetUrl.hostname) {
    case "qiita.com":
      var itemId = path.basename(targetUrl.path);
      var endpoint = "http://qiita.com/api/v2/items/"
      request
        .get(endpoint + itemId)
        .end(function(err, res){
          body = res.body.body;
          response.type('text/plain');
          response.send(md2ipynb(body));
        });
      break;
    default:
      response.send("Usage: https://nbify.herokuapp.com/<url> => .ipynb formatted data");
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
