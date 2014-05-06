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
    onSelectFrom(adressItem: AddressItem, model: string, label: string);
    onSelectTo(adressItem: AddressItem, model: string, label: string);
    doRouteCalculation();
    getRoute(fromX: number, fromY: number, toX: number, toY: number);
    updateMarkers();
    markerPoints: AddressItem[];
    fromPoint: AddressItem;
    toPoint: AddressItem;
    map: L.Map;
    
}

/* The MapController, holds functionality for the map implementation (autocomplete, searching, routing,...)*/
class MapController {
    constructor(
        private $scope: IMapControllerScope, private $http: ng.IHttpService) {


        $scope.getLocations = (val) => { return this.getLocationsSK(val,$http); };

        

        /* Update markers in the map (from and to marker)*/
        $scope.updateMarkers = function() {
            var markers = new Array();
            if (this.fromPoint != null)
                markers.push(this.fromPoint);
            if (this.toPoint != null)
                markers.push(this.toPoint);

            this.markerPoints = markers;
        };

        $scope.doRouteCalculation = function () {

            var fromX = $scope.fromPoint.location.lng;
            var fromY = $scope.fromPoint.location.lat;
            var toX = $scope.toPoint.location.lng;
            var toY = $scope.toPoint.location.lat;

            if ($scope.map.options.crs != null) {
                var pt = $scope.map.options.crs.project($scope.fromPoint.location);
                fromX = pt.x;
                fromY = pt.y;
                pt = $scope.map.options.crs.project($scope.toPoint.location);
                toX = pt.x;
                toY = pt.y;
            }

            $scope.getRoute(fromX, fromY, toX, toY);
        };

        /* Does route calculation*/
        $scope.getRoute = (fromX: number, fromY: number, toX: number, toY: number) => {
            $http.get('route.ashx', {
                params: {
                    fromX: fromX,
                    fromY: fromY,
                    toX: toX,
                    toY: toY
                }
            }).then(function (res : RouteResponseHolder) {
            });
        };

        /*Called when an autocomplete result is selected*/
        $scope.onSelectFrom = function(adressItem: AddressItem, model: string, label: string) {
            $scope.fromPoint = adressItem;
            $scope.updateMarkers();
        };

        /*Called when an autocomplete result is selected*/
        $scope.onSelectTo = function(adressItem: AddressItem, model: string, label: string) {
            $scope.toPoint = adressItem;
            $scope.updateMarkers();
        };
    }

    /* Does return locations to the autocomplete boxes for from and to place*/
    getLocationsSK = function (val, $http: ng.IHttpService) {
        return $http.get('https://ws.geonorge.no/SKWS3Index/ssr/sok', {
            params: {
                navn: val + "*",
                maxAnt: 20,
                eksakteForst: true,
            }
        }).then(function(xmlRes) {

            var x2js = new X2JS();
            var res = x2js.xml_str2json(xmlRes.data);
            var addresses = [];

            if (angular.isArray(res.sokRes.stedsnavn)) {
                angular.forEach(res.sokRes.stedsnavn, function(item) {
                    var pt = new L.Point(parseFloat(item.aust), parseFloat(item.nord));
                    var retPt = pt;
                    if (this.map.options.crs != null) {
                        retPt = this.map.options.crs.projection.unproject(pt);
                    }
                    addresses.push({ name: item.stedsnavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")", location: retPt });
                });
            } else if (res.sokRes.stedsnavn != null) {
                var item = res.sokRes.stedsnavn;
                var pt = new L.Point(parseFloat(item.aust), parseFloat(item.nord));
                var retPt = pt;
                if (this.map.options.crs != null) {
                    retPt = this.map.options.crs.projection.unproject(pt);
                }
                addresses.push({ name: item.stedsnavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")", location: retPt });
            }
            return addresses;
        });
    };

    /* Does return locations to the autocomplete boxes for from and to place*/
    getLocationsGoogle = function (val, $http : ng.IHttpService) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: val,
                sensor: false,
                language: "no",
                region: "NO",
                components: "country:NO"
            }
        }).then(function (res) {
                var addresses = [];
                angular.forEach(res.data.results, function (item) {
                    if (item.geometry != null && item.geometry.location != null) {
                        addresses.push({ name: item.formatted_address, location: item.geometry.location });
                    }
                });
                return addresses;
            });
    };


}







