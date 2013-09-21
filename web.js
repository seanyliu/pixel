var express = require('express');
var http = require('http');

/*
var fs = require('fs');

var app = express.createServer(express.logger());
app.use("/images", express.static(__dirname + '/images'));
app.use("/techDemo", express.static(__dirname + '/techDemo'));

app.get('/', function(request, response) {
  var html = fs.readFileSync('index.html');
  response.send(html.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
*/

var app = express();
app.configure(function(){
    app.use(express.static(__dirname));
});
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;
console.log("Listening on " + port);
server.listen(port);
