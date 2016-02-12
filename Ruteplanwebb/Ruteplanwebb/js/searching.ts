///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="../ts/typings/xml2json/xml2json.d.ts"/>
///<reference path="domain.ts"/>

angular.module("searching", [])
    .factory("geoCodeService", ($http, $q) => new KartVerketGeoCodeService($http, $q));

class KartVerketGeoCodeService implements SVV.RoutePlanning.IGeoCodeService {
    constructor(private $http: ng.IHttpService, private $q : ng.IQService) {   
        
    }

    getLocations = (val: string) => {
        var defer = this.$q.defer<SVV.RoutePlanning.AddressItem[]>();
        var promises = [
            this.getLocationsSKWS(val),
            this.getLocationsNorgesKart(val)
        ];

        this.$q.all(promises).then(results => {
            var ret = [];
            angular.forEach(results, (res) => {
                angular.forEach(res, item => ret.push(item));
            });

            defer.resolve(ret);
        });
        
        return defer.promise;
    }
    getLocationsNorgesKart = (val : string) => this.$http.get("http://www.norgeskart.no/ws/adr.py?" + val).then(res => {
        var addresses = new Array<SVV.RoutePlanning.AddressItem>();

        var add = (item: any) => {
            var coord = proj4.toPoint([parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE)]);
            var pcoord = proj4.transform(new proj4.Proj("EPSG:32632"), new proj4.Proj("EPSG:32633"), coord);
            var location = new OpenLayers.LonLat(pcoord.x, pcoord.y);
            var parts = [];
            angular.forEach(item.TITTEL, part => parts.push(part));
            var name = parts.join(", ");
            var address = new SVV.RoutePlanning.AddressItem(name, location);
            addresses.push(address);
        };

        if (angular.isArray(res.data)) {
            angular.forEach(res.data, item => {
                add(item);
            });
        } else if (res.data!= null) {
            add(res.data);
        }

        return addresses;

    });

    //Get from SKWS
    getLocationsSKWS = val => this.$http.get("https://ws.geonorge.no/SKWS3Index/ssr/sok", {
        params: {
            navn: val + "*",
            maxAnt: 20,
            antPerSide: 20,
            eksakteForst: true
        }
    }).then(jsonRes => {
        var res = jsonRes.data;
        var addresses = new Array<SVV.RoutePlanning.AddressItem>();

        var add = (item: any) => {
            var location = new OpenLayers.LonLat([parseFloat(item.aust), parseFloat(item.nord)]);
            var name = item.stedsnavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")";
            var address = new SVV.RoutePlanning.AddressItem(name, location);
            addresses.push(address);
        };

        if (angular.isArray(res.stedsnavn)) {
            angular.forEach(res.stedsnavn, item => {
                add(item);
            });
        } else if (res.stedsnavn != null) {
            add(res.stedsnavn);
        }

        return addresses;
    });
}