///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="helpers/OpenLayers.Awsome.Icon.d.ts"/>
///<reference path="app.ts"/>
///<reference path="domain.ts"/>
///<reference path="scopes.ts"/>

/* The MapController, holds functionality for the map implementation (autocomplete, searching, routing,...)*/
class MapController {
    constructor(private $scope: IMapControllerScope, private $http: ng.IHttpService, routingService: any, $location : ng.ILocationService) {

        $scope.getLocations = (val) => {
            return routingService.getLocationsSk(val);
        };

        $scope.doRouteCalculation = () => {
            $scope.routeLayer.removeAllFeatures();

            routingService.calculateRoute($scope.fromAddress.location, $scope.toAddress.location,
                (bounds, features, directions) => {
                    $scope.directions = directions;

                    // zoom map if current bounds does not contain route
                    //if (!$scope.map.getExtent().containsBounds(bounds)) {
                        $scope.map.zoomToExtent(bounds);
                    //}

                    // apply styles to features
                    var styles = [
                        {
                            graphicZIndex: 2,
                            strokeOpacity: 1,
                            strokeColor: "#008CFF",
                            strokeWidth: 5
                        },
                        {
                            graphicZIndex: 1,
                            strokeOpacity: 1,
                            strokeColor: "#858585",
                            strokeWidth: 5
                        }
                    ];

                    var style = 0;
                    angular.forEach(features, feature => {
                        feature.style = styles[style];
                        if (style < styles.length - 1) style++;
                    });

                    // add features to map
                    $scope.routeLayer.addFeatures(features);
                    if (directions != null && directions.length > 0)
                        $scope.selectedRouteId = directions[0].routeId;
                }
            );
        };

        $scope.updateMarkers = () => {
            $scope.markerLayer.clearMarkers();

            if ($scope.fromAddress != null) {
                var faicon = new OpenLayers.AwsomeIcon('play', 'green', 'white', 'fa');
                $scope.markerLayer.addMarker(new OpenLayers.Marker($scope.fromAddress.location, faicon));
                $location.search('from', JSON.stringify($scope.fromAddress));
            }
            if ($scope.toAddress != null) {
                var fato= new OpenLayers.AwsomeIcon('stop', 'red', 'white', 'fa');
                $scope.markerLayer.addMarker(new OpenLayers.Marker($scope.toAddress.location, fato));
                $location.search('to', JSON.stringify($scope.toAddress));
            }
            //If both from and to are set, do route calculculation automatically
            if ($scope.fromAddress != null && $scope.toAddress != null) {
                $scope.doRouteCalculation();
            }

        };

        $scope.contextMenuSetFrom = (loc:any) => {
            $scope.fromAddress = new AddressItem("Punkt i kartet", $scope.map.getLonLatFromPixel(loc));
            $scope.updateMarkers();
        };

        $scope.contextMenuSetTo = (loc: any) => {
            $scope.toAddress = new AddressItem("Punkt i kartet", $scope.map.getLonLatFromPixel(loc));
            $scope.updateMarkers();
        };

        $scope.selectedRouteId = "";

        $scope.selectRoute = routeId => {
            $scope.selectedRouteId = routeId;
        };

        $scope.showRoute = id => id === $scope.selectedRouteId;


        if ($location.search().from != null)
            $scope.fromAddress = JSON.parse($location.search().from);
        if ($location.search().to != null)
            $scope.toAddress = JSON.parse($location.search().to);

        $scope.$watch('markerLayer', () => {
            $scope.updateMarkers();
        });

    }

}
