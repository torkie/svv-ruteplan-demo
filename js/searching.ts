import * as angular from 'angular';
import * as L from 'leaflet';
import 'proj4leaflet';
import {IGeoCodeService, AddressItem} from './domain';

angular.module("searching", [])
    .factory("geoCodeService", ($http : angular.IHttpService, $q : angular.IQService) => new KartVerketGeoCodeService($http, $q));

class KartVerketGeoCodeService implements IGeoCodeService {

    private projectionUTM33 : L.Projection;
    private projectionUTM32 : L.Projection;

    constructor(private $http: ng.IHttpService, private $q : ng.IQService) {   
        this.projectionUTM33 =  new L.Proj.CRS("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs").projection;
        this.projectionUTM32 =  new L.Proj.CRS("EPSG:32632", "+proj=utm +zone=32 +ellps=WGS84 +units=m +no_defs").projection;
    }

    getLocations = (val: string) => {
        var defer = this.$q.defer<AddressItem[]>();
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
    getLocationsNorgesKart = (val : string) => this.$http.get("https://www.norgeskart.no/ws/adr.py?" + encodeURIComponent(val)).then(res => {
        var addresses = new Array<AddressItem>();

        var add = (item: any) => {

            var coordWgs = this.projectionUTM32.unproject(new L.Point(parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE)));
            var parts = [];
            angular.forEach(item.TITTEL, part => parts.push(part));
            parts.push(item.FYLKESNAVN);
            var name = parts.join(", ");
            var address = new AddressItem(name, coordWgs);
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
    getLocationsSKWS = (val : string) => this.$http.get("https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=" + encodeURIComponent(val) + "*&maxAnt=20&antPerSide=20&eksakteForst=true").then(jsonRes => {
        var res = <{stedsnavn: any}>jsonRes.data;
        var addresses = new Array<AddressItem>();

        var add = (item: any) => {
            var location = this.projectionUTM33.unproject(new L.Point(parseFloat(item.aust),parseFloat(item.nord)));
            var name = item.stedsnavn + ", " + item.kommunenavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")";
            var address = new AddressItem(name, location);
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