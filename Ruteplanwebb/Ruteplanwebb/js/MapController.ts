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
                function(bbox) {
                    $scope.map.zoomToExtent(bbox);
                }
            );
        };

        $scope.updateMarkers = () => {
            $scope.markers.clearMarkers();

            var size = new OpenLayers.Size(21, 25);
            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
            var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);

            if ($scope.fromAddress != null) {
                $scope.markers.addMarker(new OpenLayers.Marker($scope.fromAddress.location, icon));
            }
            if ($scope.toAddress != null) {
                $scope.markers.addMarker(new OpenLayers.Marker($scope.toAddress.location, icon.clone()));
            }
        };
    }

}
