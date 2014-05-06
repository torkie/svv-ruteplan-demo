var express = require("express");
var morgan = require("morgan");
var http = require("http");
var xml2js = require("xml2js");
var url = require("url");

var app = express();

app.use(morgan({ format: 'dev', immediate: true }));

app.get("/routingService", function (req, res) {
	// parse incoming request
	var q = url.parse(req.url);
	
	// options for proxy backend request, add params from incoming request
	var options = {
        host: "multirit.triona.se",
        path: "/routingService_v1_0/routingService" + q.search
    };
    console.log(options.host + options.path);

	// callback for async backend request
    callback = function (response) {
        var str = '';
        response.on("data", function (chunk) {
            str += chunk;
        });
        response.on("end", function () {
			// dump xml to json transformation
            xml2js.parseString(str, function (err, result) {
                res.write(JSON.stringify(result));
                res.end();
            });
        });
    };

	// execute async backend request
    http.request(options, callback).end();
});

app.listen(8080);
console.log("Server listening on port 8080");
