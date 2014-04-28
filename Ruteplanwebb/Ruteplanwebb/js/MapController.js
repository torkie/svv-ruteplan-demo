///<reference path="../Scripts/typings/angularjs/angular.d.ts"/>
///<reference path="../Scripts/typings/leaflet/leaflet.d.ts"/>
///<reference path="../Scripts/typings/leaflet/esri-leaflet.d.ts"/>
///<reference path="../Scripts/typings/leaflet/leaflet-mouseposition.d.ts"/>
///<reference path="../Scripts/typings/leaflet/proj4leaflet.d.ts"/>
///<reference path="app.ts"/>
/* Holder for addresses returned from autocomplete*/
var AddressItem = (function () {
    function AddressItem() {
    }
    return AddressItem;
})();

var RouteResponseHolder = (function () {
    function RouteResponseHolder() {
    }
    return RouteResponseHolder;
})();

var RouteResponse = (function () {
    function RouteResponse() {
    }
    return RouteResponse;
})();


/* The MapController, holds functionality for the map implementation (autocomplete, searching, routing,...)*/
var MapController = (function () {
    function MapController($scope, $http) {
        this.$scope = $scope;
        this.$http = $http;
        /* Does return locations to the autocomplete boxes for from and to place*/
        $scope.getLocations = function (val) {
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

        /* Update markers in the map (from and to marker)*/
        $scope.updateMarkers = function () {
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
        $scope.getRoute = function (fromX, fromY, toX, toY) {
            $http.get('route.ashx', {
                params: {
                    fromX: fromX,
                    fromY: fromY,
                    toX: toX,
                    toY: toY
                }
            }).then(function (res) {
            });
        };

        /*Called when an autocomplete result is selected*/
        $scope.onSelectFrom = function (adressItem, model, label) {
            $scope.fromPoint = adressItem;
            $scope.updateMarkers();
        };

        /*Called when an autocomplete result is selected*/
        $scope.onSelectTo = function (adressItem, model, label) {
            $scope.toPoint = adressItem;
            $scope.updateMarkers();
        };
    }
    return MapController;
})();

/* AngularDirective for &lt;map&gt; that displays an leaflet map*/
var MapDirective = (function () {
    function MapDirective() {
        L.Icon.Default.imagePath = 'images/';
        this.restrict = 'E';
        this.replace = true;
        this.template = '<div pointsource="markerPoints"></div>';

        var crs = new L.Proj.CRS('EPSG:25833', '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
            transformation: new L.Transformation(1, 2500000, -1, 9045984),
            resolutions: [
                21674.7100160867,
                10837.35500804335,
                5418.677504021675,
                2709.3387520108377,
                1354.6693760054188,
                677.3346880027094,
                338.6673440013547,
                169.33367200067735,
                84.66683600033868,
                42.33341800016934,
                21.16670900008467,
                10.583354500042335,
                5.291677250021167,
                2.6458386250105836,
                1.3229193125052918,
                0.6614596562526459,
                0.33072982812632296
            ]
        });

        this.link = function (scope, element, attrs) {
            this.map = new L.Map('map', {
                center: new L.LatLng(59.95501, 10.71167),
                continuousWorld: true,
                worldCopyJump: false,
                zoom: 8,
                crs: crs
            });

            scope.map = this.map;

            var tilesAttrib = 'Kartdata <a href="http://vegvesen.no">Statens Vegvesen</a>, <a href="http://statkart.no">Statens Kartverk</a> og Kommuner';
            var tileLayer = new L.esri.TiledMapLayer("http://svvmapcache.opentns.org/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", { attribution: tilesAttrib });

            tileLayer.addTo(this.map);

            var mousePos = new L.Control.MousePosition({ numDigits: 1 });
            mousePos.addTo(this.map);

            function updatePoints(value) {
                if (this.markers != null) {
                    angular.forEach(this.markers, function (item) {
                        this.map.removeLayer(item);
                    });
                }
                this.markers = new Array();
                angular.forEach(value, function (item) {
                    var m = L.marker(item.location);
                    this.markers.push(m);
                    m.addTo(this.map);
                });
            }
            ;

            scope.$watch(attrs.pointsource, function (value) {
                updatePoints(value);
            });
        };
    }
    return MapDirective;
})();

var SeachBarDirective = (function () {
    function SeachBarDirective() {
        this.restrict = 'E';
        this.replace = true;
        this.template = '<div><div><b>Ruteplan demo</b><br/>' + 'Fra: <input type="text" ng-model="selectedFrom"  id="searchFrom" typeahead="address.name for address in getLocations($viewValue) | filter:$viewValue" typeahead-leading="loadingAdressFrom" typeahead-on-select="onSelectFrom($item,$model,$label)"/><i ng-show="loadingAdressFrom" class="glyphicon glyphicon-refresh"></i> Til: <input type="text"  ng-model="selectedTo"  typeahead="address.name for address in getLocations($viewValue) | filter:$viewValue" typeahead-leading="loadingAdressTo" typeahead-on-select="onSelectTo($item,$model,$label)" id="searchTo"/><i ng-show="loadingAdressTo" class="glyphicon glyphicon-refresh"></i>' + '<input id="searchbutton" type="button" value="Søk" ng-click="doRouteCalculation()"/></div></div>';
        this.link = function (scope, element, attrs) {
        };
    }
    return SeachBarDirective;
})();

svvRuteplanApp.directive('map', function () {
    return new MapDirective();
});
svvRuteplanApp.directive('searchbar', function () {
    return new SeachBarDirective();
});
//# sourceMappingURL=MapController.js.map
