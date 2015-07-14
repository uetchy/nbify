var request = require('superagent');
var url = require('url');
var path = require('path');
var md2ipynb = require('md2ipynb');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));

app.get('/*', function(req, res) {
  var targetUrl = url.parse(req.params[0]);
  switch(targetUrl.hostname) {
    case "qiita.com":
      var itemId = path.basename(targetUrl.path);
      var endpoint = "http://qiita.com/api/v2/items/"
      request
        .get(endpoint + itemId)
        .end(function(err, data){
          body = data.body.body;
          res.type('text/plain');
          res.attachment(itemId + ".ipynb");
          res.send(md2ipynb(body));
        });
      break;
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running http://localhost:' + app.get('port'));
});
