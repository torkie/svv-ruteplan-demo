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
app.get("/routingService", function(req, res) {
    // parse incoming request
    var q = url.parse(req.url, true);

    // request adds special queryparameters to specify backend url
    var backend_url = q.query.backend_url;
    var backend_username = q.query.backend_username;
    var backend_password = q.query.backend_password;

    // remove special queryparameters from backend request
    delete q.query.backend_url;
    delete q.query.backend_username;
    delete q.query.backend_password;

    var host = "multirit.triona.se";
    var pathname = "/routingService_v1_0/routingService";
    var headers = {};

    // parse backend url
    if (backend_url !== undefined) {
        var backend = url.parse(backend_url);
        if (backend !== undefined && backend.host !== undefined) {
            // only accept vegvesen.no and triona.se hosts
            if (backend.host.match("(\\.vegvesen\\.no|\\.triona\\.se)$") !== null) {
                host = backend.host;
                pathname = backend.pathname;
            } else {
                console.log('"unsafe" url: ' + backend_url);
                res.status(400);
                res.end();
                return;
            }

            // add basic auth if username/password is specified
            if (backend_username !== undefined && backend_password !== undefined) {
                headers["Authorization"] = "Basic " + new Buffer(backend_username + ":" + backend_password).toString("base64");
            }
        }
    }

    // use query parameters from request
    var options = {
        host: host,
        path: pathname + q.search,
        headers: headers
    };

    // callback for async backend request
    var callback = function(response) {
        response.on("data", function(chunk) {
            res.write(chunk);
        });
        response.on("end", function() {
            res.end();
        });
    };

    // execute async backend request
    http.request(options, callback).end();
});

/*
 GetCapabilities Proxy.
 */
app.get("/wmsCapabilities", function(req, res) {
    // parse incoming request
    var q = url.parse(req.url, true);
    var wms = url.parse(q.query.url);

    // use query parameters from request
    var options = {
        host: wms.hostname,
        port: wms.port,
        path: wms.pathname + "?REQUEST=GetCapabilities&SERVICE=WMS"
    };

    // callback for async backend request
    var callback = function(response) {
        response.on("data", function(chunk) {
            res.write(chunk);
        });
        response.on("end", function() {
            res.end();
        });
    };

    // execute async backend request
    http.request(options, callback).end();
});

app.listen(8080);
console.log("Server listening on port 8080");
