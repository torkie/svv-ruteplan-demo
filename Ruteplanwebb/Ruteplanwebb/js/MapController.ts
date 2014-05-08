///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/leaflet/leaflet.d.ts"/>
///<reference path="../ts/typings/leaflet/esri-leaflet.d.ts"/>
///<reference path="../ts/typings/leaflet/leaflet-mouseposition.d.ts"/>
///<reference path="../ts/typings/leaflet/proj4leaflet.d.ts"/>
///<reference path="domain.ts"/>
///<reference path="app.ts"/>
///<reference path="../ts/typings/xml2json/xml2json.d.ts"/>

/* $scope for MapController with extra methods and properties*/
interface IMapControllerScope extends ng.IScope {
    getLocations(adress: string);
    onSelectFrom(adressItem: AddressItem);
    onSelectTo(adressItem: AddressItem);
    doRouteCalculation();
    getRoute(fromX: number, fromY: number, toX: number, toY: number);
    updateMarkers();
    updateMarkers2();
    markerPoints: AddressItem[];
    fromPoint: AddressItem;
    toPoint: AddressItem;
    map: L.Map;
    selectedFrom: any;
    fromAddress: AddressItem;
    toAddress: AddressItem;
    markers: OpenLayers.Layer.Markers;
}

/* The MapController, holds functionality for the map implementation (autocomplete, searching, routing,...)*/
class MapController {
    constructor(private $scope: IMapControllerScope, private $http: ng.IHttpService) {

        $scope.getLocations = (val) => {
            return this.getLocationsSk($scope, val, $http);
        };

//        $scope.doRouteCalculation = () => {
//
//            var fromX = $scope.fromPoint.location.lng;
//            var fromY = $scope.fromPoint.location.lat;
//            var toX = $scope.toPoint.location.lng;
//            var toY = $scope.toPoint.location.lat;
//
//            if ($scope.map.options.crs != null) {
//                var pt = $scope.map.options.crs.project($scope.fromPoint.location);
//                fromX = pt.x;
//                fromY = pt.y;
//                pt = $scope.map.options.crs.project($scope.toPoint.location);
//                toX = pt.x;
//                toY = pt.y;
//            }
//
//            $scope.getRoute(fromX, fromY, toX, toY);
//        };

        /* Does route calculation */
        $scope.getRoute = (fromX: number, fromY: number, toX: number, toY: number) => {
            $http.get('routingService', {
                params: {
                    stops: fromX + "," + fromY + ";" + toX + "," + toY,
                    format: "json"
                }
            }).success((data: any) => {
                var bbox = data.directions[0].summary.envelope;
                var sw = $scope.map.options.crs.projection.unproject(new L.Point(bbox.xmin, bbox.ymin));
                var ne = $scope.map.options.crs.projection.unproject(new L.Point(bbox.xmax, bbox.ymax));
                $scope.map.fitBounds(L.latLngBounds(sw, ne));
            });
        };

        $scope.updateMarkers2 = () => {
            console.log("UpdateMarkers2");
            console.log($scope.fromAddress.location);
            console.log($scope.toAddress);

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

    /* Does return locations to the autocomplete boxes for from and to place*/
    getLocationsSk = ($scope, val, $http: ng.IHttpService) => $http.get('https://ws.geonorge.no/SKWS3Index/ssr/sok', {
        params: {
            navn: val + "*",
            maxAnt: 20,
            eksakteForst: true
        }
    }).then(function(xmlRes) {

        var x2Js = new X2JS();
        var res = x2Js.xml_str2json(xmlRes.data);
        var addresses = [];

        if (angular.isArray(res.sokRes.stedsnavn)) {
            angular.forEach(res.sokRes.stedsnavn, function(item) {
                var location = new OpenLayers.LonLat([parseFloat(item.aust), parseFloat(item.nord)]);
                var name = item.stedsnavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")";
                var address = new AddressItem(name, location);
                addresses.push(address);
            });
        } else if (res.sokRes.stedsnavn != null) {
            var item = res.sokRes.stedsnavn;
            var location = new OpenLayers.LonLat([parseFloat(item.aust), parseFloat(item.nord)]);
            var name = item.stedsnavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")";
            var address = new AddressItem(name, location);
            addresses.push(address);
        }
        return addresses;
    });

    /* Does return locations to the autocomplete boxes for from and to place */
    getLocationsGoogle = ($scope, val, $http: ng.IHttpService) => $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: val,
            sensor: false,
            language: "no",
            region: "NO",
            components: "country:NO"
        }
    }).then(res => {
        var addresses = [];
        angular.forEach(res.data.results, item => {
            if (item.geometry != null && item.geometry.location != null) {
                addresses.push({ name: item.formatted_address, location: item.geometry.location });
            }
        });
        return addresses;
    });
}
