var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
app.use("/images", express.static(__dirname + '/images'));

app.get('/', function(request, response) {
  var html = fs.readFileSync('index.html');
  response.send(html.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
