var express = require("express");
var morgan = require("morgan");
var http = require("http");
var url = require("url");

app = express();
app.use(morgan());
app.use(express.static(__dirname, {"index": ["default.htm", "index.html"], maxAge: 24 * 60 * 60 * 1000}));

/*
  Dumb reverse proxy to routing service.
 */
app.get("/routingService", function (req, res) {
  // parse incoming request
  var q = url.parse(req.url);

  // options for proxy backend request, add params from incoming request
  var options = {
    host: "multirit.triona.se",
    path: "/routingService_v1_0/routingService" + q.search
  };

  // callback for async backend request
  callback = function (response) {
    response.on("data", function (chunk) {
      res.write(chunk);
    });
    response.on("end", function () {
      res.end();
    });
  };

  // execute async backend request
  http.request(options, callback).end();
});

app.listen(8080);
console.log("Server listening on port 8080");
