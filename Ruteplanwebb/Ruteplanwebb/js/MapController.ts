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
    map: OpenLayers.Map;
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

        $scope.doRouteCalculation = () => {
            var fromX = $scope.fromAddress.location.lon;
            var fromY = $scope.fromAddress.location.lat;
            var toX = $scope.toAddress.location.lon;
            var toY = $scope.toAddress.location.lat;
            $http.get('routingService', {
                params: {
                    stops: fromX + "," + fromY + ";" + toX + "," + toY,
                    format: "json"
                }
            }).success((data: any) => {
                var bbox = data.directions[0].summary.envelope;
                $scope.map.zoomToExtent(<number[]>[bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax]);
            });
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

}
