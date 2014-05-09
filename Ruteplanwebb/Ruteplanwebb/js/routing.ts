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
                var bbox = data.directions[0].summary.envelope;
                callback(<number[]>[bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax]);
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
