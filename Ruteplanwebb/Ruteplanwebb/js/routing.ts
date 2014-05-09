///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>

angular.module("routing", [])
    .factory("routingService", function($http) {

        var calculateRoute = function(from: OpenLayers.LonLat, to: OpenLayers.LonLat, callback: any) {
            $http.get('routingService', {
                params: {
                    stops: from.lon + "," + from.lat + ";" + to.lon + "," + to.lat,
                    format: "json"
                }
            }).success((data: any) => {
                var bbox = data.directions[0].summary.envelope;
                callback(<number[]>[bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax]);
            });
        };

        return {
            calculateRoute: calculateRoute
        }

    });
