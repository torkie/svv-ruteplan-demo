///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="app.ts"/>
///<reference path="domain.ts"/>
///<reference path="scopes.ts"/>

/* The MapController, holds functionality for the map implementation (autocomplete, searching, routing,...)*/
class MapController {
    constructor(private $scope: IMapControllerScope, private $http: ng.IHttpService, routingService: any) {

        $scope.getLocations = (val) => {
            return routingService.getLocationsSk(val);
        };

        $scope.doRouteCalculation = () => {
            routingService.calculateRoute($scope.fromAddress.location, $scope.toAddress.location,
                function(bbox, routes) {
                    $scope.map.zoomToExtent(bbox);

                    var features = [];

                    var styles = [
                        {
                            graphicZIndex: 2,
                            strokeOpacity: 1,
                            strokeColor: "#0000ff",
                            strokeWidth: 5
                        },
                        {
                            graphicZIndex: 1,
                            strokeOpacity: 1,
                            strokeColor: "#00ff00",
                            strokeWidth: 5
                        },
                        {
                            graphicZIndex: 0,
                            strokeOpacity: 1,
                            strokeColor: "#ff0000",
                            strokeWidth: 5
                        }
                    ];

                    var style = 0;
                    var forEach = angular.forEach;
                    forEach(routes, function(route) {
                        var components = [];
                        forEach(route.geometry.paths, function(path) {
                            var points = [];
                            forEach(path, function(point) {
                                points.push(new OpenLayers.Geometry.Point(<number>point[0], <number>point[1]));
                            });
                            components.push(new OpenLayers.Geometry.LineString(points));
                        });
                        var geometry = new OpenLayers.Geometry.MultiLineString(components);
                        features.push(new OpenLayers.Feature.Vector(geometry, {}, styles[style]));
                        style++;
                    });

                    $scope.routeLayer.removeAllFeatures();
                    $scope.routeLayer.addFeatures(features);
                }
            );
        };

        $scope.updateMarkers = () => {
            $scope.markerLayer.clearMarkers();

            var size = new OpenLayers.Size(21, 25);
            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);

            if ($scope.fromAddress != null) {
                var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker-green.png', size, offset);
                $scope.markerLayer.addMarker(new OpenLayers.Marker($scope.fromAddress.location, icon));
            }
            if ($scope.toAddress != null) {
                var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
                $scope.markerLayer.addMarker(new OpenLayers.Marker($scope.toAddress.location, icon));
            }
        };
    }

}
