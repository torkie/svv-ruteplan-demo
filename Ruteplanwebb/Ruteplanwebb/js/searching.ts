///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="../ts/typings/xml2json/xml2json.d.ts"/>
///<reference path="domain.ts"/>

angular.module("searching", [])
    .factory("geoCodeService", $http => new KartVerketGeoCodeService($http));

class KartVerketGeoCodeService implements SVV.RoutePlanning.IGeoCodeService {
    constructor(private $http: ng.IHttpService) {
    }

    getLocations = val => this.$http.get("https://ws.geonorge.no/SKWS3Index/ssr/sok", {
        params: {
            navn: val + "*",
            maxAnt: 20,
            antPerSide: 20,
            eksakteForst: true
        }
    }).then(xmlRes => {
        var x2Js = new X2JS();
        var res = x2Js.xml_str2json(xmlRes.data);
        var addresses = new Array<SVV.RoutePlanning.AddressItem>();

        var add = (item: any) => {
            var location = new OpenLayers.LonLat([parseFloat(item.aust), parseFloat(item.nord)]);
            var name = item.stedsnavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")";
            var address = new SVV.RoutePlanning.AddressItem(name, location);
            addresses.push(address);
        };

        if (angular.isArray(res.sokRes.stedsnavn)) {
            angular.forEach(res.sokRes.stedsnavn, item => {
                add(item);
            });
        } else if (res.sokRes.stedsnavn != null) {
            add(res.sokRes.stedsnavn);
        }

        return addresses;
    });
}