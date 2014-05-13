///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="../ts/typings/xml2json/xml2json.d.ts"/>
///<reference path="domain.ts"/>

angular.module("routing", [])
    .factory("routingService", $http => {

    var calculateRoute = (from: OpenLayers.LonLat, to: OpenLayers.LonLat, callback: any) => {
        $http.get('routingService', {
            params: {
                stops: from.lon + "," + from.lat + ";" + to.lon + "," + to.lat,
                format: "json",
                lang: "nb-no"
            }
        }).success((data: any) => {
            var forEach = angular.forEach;

            // calculate bounding box for all routes
            var bounds = null;
            angular.forEach(data.directions, direction => {
                var bbox = direction.summary.envelope;
                var routeBounds = new OpenLayers.Bounds(<number[]>[bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax]);
                if (bounds == null) {
                    bounds = routeBounds;
                } else {
                    bounds.extend(routeBounds);
                }
            });

            // create geometry features from routes
            var features = [];
            forEach(data.routes.features, route => {
                var components = [];
                forEach(route.geometry.paths, path => {
                    var points = [];
                    forEach(path, point => {
                        points.push(new OpenLayers.Geometry.Point(<number>point[0], <number>point[1]));
                    });
                    components.push(new OpenLayers.Geometry.LineString(points));
                });
                var geometry = new OpenLayers.Geometry.MultiLineString(components);
                features.push(new OpenLayers.Feature.Vector(geometry));
            });

            forEach(data.directions, (direction) => {
                forEach(direction.features, (feature) => {
                    feature.roadCat = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$1");
                    feature.roadNumber = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$2");
                    feature.attributes.text = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\} (.*)/i, "$3");
                });
            });

            var directions = data.directions;
            for (var i = 0; i < directions.length; i++) {
                directions[i].TotalTollLarge = data.routes.features[i].attributes["Total_Toll large"];
                directions[i].TotalTollSmall = data.routes.features[i].attributes["Total_Toll small"];
            }

            callback(bounds, features, directions);
        });
    };

    var getLocationsSk = val => $http.get("https://ws.geonorge.no/SKWS3Index/ssr/sok", {
        params: {
            navn: val + "*",
            maxAnt: 20,
            antPerSide: 20,
            eksakteForst: true
        }
    }).then(xmlRes => {
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
            angular.forEach(res.sokRes.stedsnavn, item => {
                add(item);
            });
        } else if (res.sokRes.stedsnavn != null) {
            add(res.sokRes.stedsnavn);
        }

        return addresses;
    });

    return {
        calculateRoute: calculateRoute,
        getLocationsSk: getLocationsSk
    }

});
