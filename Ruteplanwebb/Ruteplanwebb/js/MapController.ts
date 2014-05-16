///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="helpers/OpenLayers.Awsome.Icon.d.ts"/>
///<reference path="app.ts"/>
///<reference path="domain.ts"/>
///<reference path="scopes.ts"/>

/* The MapController, holds functionality for the map implementation (autocomplete, searching, routing,...)*/
class MapController {

    constructor(private $scope: IMapControllerScope, private $http: ng.IHttpService, routingService: SVV.RoutePlanning.IRoutingService,  geoCodeService: SVV.RoutePlanning.IGeoCodeService, $location : ng.ILocationService) {

        var routeStyle = {
            graphicZIndex: 2,
            strokeOpacity: 1,
            strokeColor: "#008CFF",
            strokeWidth: 5
        };

        var alternativeRouteStyle = {
            graphicZIndex: 1,
            strokeOpacity: 1,
            strokeColor: "#858585",
            strokeWidth: 5
        };

        $scope.getLocations = (val) => {
            return geoCodeService.getLocations(val);
        };

        $scope.doRouteCalculation = () => {
            $scope.routeLayer.removeAllFeatures();
            $scope.directions = null;

            var locations = [];
            var idx = 0;
            locations[idx++] = $scope.fromAddress.location;

            if ($scope.intermediateAddresses != null) {
                angular.forEach($scope.intermediateAddresses, (med) => {
                    locations[idx++] = med.location;
                });
            }
            locations[idx] = $scope.toAddress.location;

            routingService.calculateRoute(locations,
                (bounds, features : SVV.RoutePlanning.RouteResponseRouteFeature[], directions : SVV.RoutePlanning.ViewDirection[]) => {
                    $scope.directions = directions;

                    // zoom map if current bounds does not contain route
                    //if (!$scope.map.getExtent().containsBounds(bounds)) {
                        $scope.map.zoomToExtent(bounds);
                    //}

                    // apply styles to features
                    var styles = [routeStyle, alternativeRouteStyle];

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
            , $scope.blockedPoints, $scope.blockedAreas);
        };

        $scope.reverseRoute = () => {
            var from = $scope.fromAddress;
            $scope.fromAddress = $scope.toAddress;
            $scope.toAddress = from;

            if ($scope.intermediateAddresses != undefined) {
                $scope.intermediateAddresses.reverse();
            }


            $scope.updateMarkers();
        };

        $scope.updateMarkers = () => {
            $scope.markerLayer.destroyFeatures();

            if ($scope.fromAddress != null) {
                var featureFrom = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point($scope.fromAddress.location.lon, $scope.fromAddress.location.lat),null,
                 {externalGraphic: '/images/frommarker.png', graphicHeight: 46, graphicWidth: 35,      graphicXOffset:-17, graphicYOffset:-46  });
                $scope.markerLayer.addFeatures([featureFrom]);
                $location.search('from', JSON.stringify($scope.fromAddress));
            }
            if ($scope.toAddress != null) {
                var featureTo = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point($scope.toAddress.location.lon, $scope.toAddress.location.lat), null,
                { externalGraphic: '/images/tomarker.png', graphicHeight: 46, graphicWidth: 35, graphicXOffset: -17, graphicYOffset: -46 });
                $scope.markerLayer.addFeatures([featureTo]);

                $location.search('to', JSON.stringify($scope.toAddress));
            }

            if ($scope.intermediateAddresses != undefined) {
                angular.forEach($scope.intermediateAddresses, (addr) => {
                    var featurevia = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(addr.location.lon, addr.location.lat), null,
                    { externalGraphic: '/images/viamarker.png', graphicHeight: 46, graphicWidth: 35, graphicXOffset: -17, graphicYOffset: -46 });
                    $scope.markerLayer.addFeatures([featurevia]);
                });
                $location.search('intermediate', JSON.stringify($scope.intermediateAddresses));
            }

            if ($scope.blockedPoints != undefined) {
                angular.forEach($scope.blockedPoints, (point) => {
                    var featureBlockedPoint = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(point.lon, point.lat), null,
                        { externalGraphic: '/images/block-icon.png', graphicHeight: 25, graphicWidth: 25, graphicXOffset: -12, graphicYOffset: -12 });
                    //console.log(featureBlockedPoint);
                    $scope.markerLayer.addFeatures([featureBlockedPoint]);
                });
                $location.search('blockedPoints', JSON.stringify($scope.blockedPoints));
            }

            if ($scope.blockedAreas != undefined) {
                angular.forEach($scope.blockedAreas, (area) => {
                    angular.forEach(area.points, (point) => {
                        var featureBlockedPoint = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(point.lon, point.lat), null,
                            { externalGraphic: '/images/viamarker.png', graphicHeight: 46, graphicWidth: 35, graphicXOffset: -17, graphicYOffset: -46 });

                        $scope.markerLayer.addFeatures([featureBlockedPoint]);
                    })
               });
                $location.search('blockedAreas', JSON.stringify($scope.blockedAreas));
            }

            //If both from and to are set, do route calculation automatically
            if ($scope.fromAddress != null && $scope.toAddress != null) {
                $scope.doRouteCalculation();
            }

        };

        $scope.contextMenuAddIntermediate = (loc:any) => {
            if ($scope.intermediateAddresses === undefined) {
                $scope.intermediateAddresses = [];
            }

            var latlon = $scope.map.getLonLatFromPixel(loc);
            var idx = $scope.intermediateAddresses.length;
            $scope.intermediateAddresses[idx] = new SVV.RoutePlanning.AddressItem("Via: Punkt i kartet", latlon);
            $scope.updateMarkers();
        };

        $scope.removeIntermediate = (item:SVV.RoutePlanning.AddressItem) => {
            var idx = $scope.intermediateAddresses.indexOf(item);

            $scope.intermediateAddresses.splice(idx, 1);

            $scope.updateMarkers();
        };

        $scope.contextMenuSetFrom = (loc:any) => {
            var latlon = $scope.map.getLonLatFromPixel(loc);
            $scope.fromAddress = new SVV.RoutePlanning.AddressItem("Punkt i kartet", latlon);
            $scope.updateMarkers();
        };

        $scope.contextMenuSetTo = (loc: any) => {
            var latlon = $scope.map.getLonLatFromPixel(loc);
            $scope.toAddress = new SVV.RoutePlanning.AddressItem("Punkt i kartet", latlon);
            $scope.updateMarkers();
        };

        $scope.toggleMapControl = (key : string) => {
            angular.forEach($scope.controls, (wrapper) => {
                if (wrapper.name == key) {
                    wrapper.control.activate();
                } else {
                    wrapper.control.deactivate();
                }
            });
        };

        $scope.selectedRouteId = null;

        $scope.selectRoute = routeId => {
            $scope.selectedRouteId = routeId;
            angular.forEach($scope.routeLayer.features, function(feature) {
                if (feature.routeId === routeId) {
                    feature.style = routeStyle;
                } else {
                    feature.style = alternativeRouteStyle;
                }
                $scope.routeLayer.drawFeature(feature);
            });
        };

        $scope.showRoute = id => id === $scope.selectedRouteId;

        $scope.zoomToDirection = (routeId: number) => {
            $scope.map.zoomToExtent($scope.directions[routeId].Bounds);
        };

        if ($location.search().from != null) {
            $scope.fromAddress = JSON.parse($location.search().from);
        }
        if ($location.search().to != null) {
            $scope.toAddress = JSON.parse($location.search().to);
        }

        if ($location.search().intermediate != null) {
            $scope.intermediateAddresses = JSON.parse($location.search().intermediate);
        }

        if ($location.search().blockedPoints != null) {
            $scope.blockedPoints = JSON.parse($location.search().blockedPoints);
        }

        if ($location.search().blockedAreas != null) {
            $scope.blockedAreas = JSON.parse($location.search().blockedAreas);
        }

        $scope.$watch('markerLayer', () => {
            $scope.updateMarkers();
        });

        $scope.downloadRouteAsKML = (routeId : number,$event) => {
            var elem = $event.target;
            var kml = 'testar';
            var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(kml);
            elem.setAttribute("target", "_blank");
            elem.setAttribute("href", data);

        }

    }

}
