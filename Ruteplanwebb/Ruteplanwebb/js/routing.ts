///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="../ts/typings/xml2json/xml2json.d.ts"/>
///<reference path="domain.ts"/>

angular.module("routing", [])
    .factory("routingService", $http => new RoutingService($http));

class RoutingService implements SVV.RoutePlanning.IRoutingService {
    constructor(private $http: ng.IHttpService) {
    }

    calculateRoute = (stops: OpenLayers.LonLat[], callback: SVV.RoutePlanning.IRouteCalculationCallback) => {
        var strings = [];
        angular.forEach(stops, (stop) => {
            strings.push(stop.lon+","+stop.lat);
        });

        this.$http.get('routingService', {
            params: {
                stops: strings.join(";"),
                format: "json",
                lang: "nb-no"
            }
        }).success((data: SVV.RoutePlanning.RouteResponse) => {
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
            var directions = <SVV.RoutePlanning.ViewDirection[]>data.directions;
            for (var i = 0; i < directions.length; i++) {
                forEach(directions[i].features, (feature: SVV.RoutePlanning.ViewDirectionFeature) => {
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


