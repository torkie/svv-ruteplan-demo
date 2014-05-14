///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="../ts/typings/xml2json/xml2json.d.ts"/>
///<reference path="domain.ts"/>

angular.module("routing", [])
    .factory("routingService", $http => new RoutingService($http));

class RoutingService implements SVV.RutePlan.IRoutingService {
    constructor(private $http: ng.IHttpService) {
    }

    calculateRoute = (stops: OpenLayers.LonLat[], callback: SVV.RutePlan.IRouteCalculationCallback) => {
        var strings = [];
        var idx = 0;
        angular.forEach(stops, (stop) => {
            strings[idx++] = stop.lon+","+stop.lat;
        });
        var stopsArg = strings.join(";");

        this.$http.get('routingService', {
            params: {
                stops: stopsArg,
                format: "json",
                lang: "nb-no"
            }
        }).success((data: SVV.RutePlan.RouteResponse) => {
            var forEach = angular.forEach;

            // create geometry features from routes
            var features = [];
            forEach(data.routes.features, route => {
                var components = [];
                forEach(route.geometry.paths, path => {
                    var points = [];
                    forEach(path, point => {
                        points.push(new OpenLayers.Geometry.Point(<number>point[0], <number>point[1]));
                    });
                    components.push(new OpenLayers.Geometry.LineString(points));
                });
                var geometry = new OpenLayers.Geometry.MultiLineString(components);
                features.push(new OpenLayers.Feature.Vector(geometry));
            });

            // calculate bounding box for all routes
            var totalBounds = null;
            var directions = <SVV.RutePlan.ViewDirection[]>data.directions;
            for (var i = 0; i < directions.length; i++) {
                forEach(directions[i].features, (feature: SVV.RutePlan.ViewDirectionFeature) => {
                    feature.roadCat = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$1");
                    feature.roadNumber = parseInt(feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$2"));
                    feature.attributes.text = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\} (.*)/i, "$3");
                });
                directions[i].TotalTollLarge = data.routes.features[i].attributes["Total_Toll large"];
                directions[i].TotalTollSmall = data.routes.features[i].attributes["Total_Toll small"];
                var bbox = directions[i].summary.envelope;
                directions[i].Bounds = new OpenLayers.Bounds(<number[]>[bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax]);

                if (totalBounds == null) {
                    totalBounds = directions[i].Bounds;
                } else {
                    totalBounds.extend(directions[i].Bounds);
                }
            }

            callback(totalBounds, features, directions);
        });
    };

    
}


