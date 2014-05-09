///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="../ts/typings/xml2json/xml2json.d.ts"/>
///<reference path="domain.ts"/>

angular.module("routing", [])
    .factory("routingService", function($http) {

        var calculateRoute = function(from: OpenLayers.LonLat, to: OpenLayers.LonLat, callback: any) {
            $http.get('routingService', {
                params: {
                    stops: from.lon + "," + from.lat + ";" + to.lon + "," + to.lat,
                    format: "json"
                }
            }).success((data: any) => {
                var forEach = angular.forEach;

                // calculate bounding box for all routes
                var bounds = null;
                angular.forEach(data.directions, function(direction) {
                    var bbox = direction.summary.envelope;
                    var routeBounds = new OpenLayers.Bounds(<number[]>[bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax]);
                    if (bounds == null) {
                        bounds = routeBounds;
                    } else {
                        bounds.extend(routeBounds);
                    }
                });

                // create geometry features from routes
                var features = [];
                forEach(data.routes.features, function(route) {
                    var components = [];
                    forEach(route.geometry.paths, function(path) {
                        var points = [];
                        forEach(path, function(point) {
                            points.push(new OpenLayers.Geometry.Point(<number>point[0], <number>point[1]));
                        });
                        components.push(new OpenLayers.Geometry.LineString(points));
                    });
                    var geometry = new OpenLayers.Geometry.MultiLineString(components);
                    features.push(new OpenLayers.Feature.Vector(geometry));
                });

                // route info, directions[0].routeName
                var routeInfo = [];
                forEach(data.directions, function(direction) {
                    routeInfo.push({
                        name: direction.routeName,
                        distance: direction.totalDistance,
                        time: direction.totalTime
                    });
                });

                callback(bounds, features, routeInfo);
            });
        };

        var getLocationsSk = function(val) {
            return $http.get("https://ws.geonorge.no/SKWS3Index/ssr/sok", {
                params: {
                    navn: val + "*",
                    maxAnt: 20,
                    antPerSide: 20,
                    eksakteForst: true
                }
            }).then(function(xmlRes) {
                var x2Js = new X2JS();
                var res = x2Js.xml_str2json(xmlRes.data);
                var addresses = new Array<AddressItem>();

                var add = (item: any) => {
                    var location = new OpenLayers.LonLat([parseFloat(item.aust), parseFloat(item.nord)]);
                    var name = item.stedsnavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")";
                    var address = new AddressItem(name, location);
                    addresses.push(address);
                };

                if (angular.isArray(res.sokRes.stedsnavn)) {
                    angular.forEach(res.sokRes.stedsnavn, function(item) {
                        add(item);
                    });
                } else if (res.sokRes.stedsnavn != null) {
                    add(res.sokRes.stedsnavn);
                }

                return addresses;
            });
        };

        return {
            calculateRoute: calculateRoute,
            getLocationsSk: getLocationsSk
        }

    });
