///<reference path="../../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="../../ts/typings/xml2json/xml2json.d.ts"/>
///<reference path="../domain.ts"/>

angular.module("routing", ["rpwSettings"])
    .factory("routingService", ($http, settings) => new RoutingService($http, settings));

class RoutingService implements SVV.RoutePlanning.IRoutingService {
    constructor(private $http: ng.IHttpService, private settings: any) {
    }

    private _routeType: string;

    calculateRoute = (stops: OpenLayers.LonLat[], callback: SVV.RoutePlanning.IRouteCalculationCallback, blockedPoints?: OpenLayers.LonLat[], blockedAreas?: SVV.RoutePlanning.Polygon[], powerEffort?: number, bikePathUsage?: number, routeType?: string) => {
        var strings = [];
        angular.forEach(stops, (stop) => {
            strings.push(stop.lon + "," + stop.lat);
        });
        var stopsParameter = strings.join(";");

        strings = [];
        if (blockedPoints != undefined) {
            angular.forEach(blockedPoints, (p) => {
                strings.push(p.lon + "," + p.lat);
            });
        }
        var pointBarriersParameter = strings.join(";");

        strings = [];

        var useProxy = this.settings.useproxy || this.settings.username;

        var url = useProxy ? 'routingService' : this.settings.url;
        var params = <any>{
            stops: stopsParameter,
            barriers: pointBarriersParameter,
            powerEffort: powerEffort, 
            bikePathUsage: bikePathUsage,
            format: "json",
            lang: "nb-no",

        };

        if (useProxy) {
            params.backend_url = this.settings.url;
            params.backend_username = this.settings.username;
            params.backend_password = this.settings.password;
        }
        if (this.settings.routetype && this.settings.routetype.length > 0) {
            params.route_type = this.settings.routetype;
        }
        if (routeType != undefined) {
            params.route_type = routeType;
        }
        this._routeType = params.route_type;

        this.$http.get(url, {
            params: params
        }).success((data: SVV.RoutePlanning.RouteResponse) => {
            var forEach = angular.forEach;

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

            // calculate bounding box for all routes
            var totalBounds = null;
            var directions = <SVV.RoutePlanning.ViewDirection[]>data.directions;
            for (var i = 0; i < directions.length; i++) {
                var dir: SVV.RoutePlanning.ViewDirection = directions[i];

                forEach(dir.features, (feature: SVV.RoutePlanning.ViewDirectionFeature) => {
                    if (feature.attributes.text.match(/\{([ERFKPS])(\d+)\}.*/i)) {
                        feature.roadCat = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$1");
                        feature.roadNumber = parseInt(feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$2"));
                        feature.attributes.text = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\} (.*)/i, "$3");
                    }

                    feature.turnIconClass = this.getTurnIconForEsriManeuvre(feature.attributes.maneuverType);

                });
                dir.TotalTollLarge = data.routes.features[i].attributes["Total_Toll large"];
                dir.TotalTollSmall = data.routes.features[i].attributes["Total_Toll small"];
                var bbox = dir.summary.envelope;
                dir.Bounds = new OpenLayers.Bounds(<number[]>[bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax]);

                if (this._routeType == "bike") {
                    this._setExtraProperties(dir);
                }

                if (totalBounds == null) {
                    totalBounds = dir.Bounds;
                }
                else {
                    totalBounds.extend(dir.Bounds);
                }

                features[i].routeId = dir.routeId;
            }

            callback(totalBounds, features, directions);
        });
    };


    getTurnIconForEsriManeuvre = (esriManeuvreType : string) => {
        switch (esriManeuvreType) {
        case "esriDMTStraight":
            return "icon-straight";
        case "esriDMTBearLeft":
            return "icon-bearleft";
        case "esriDMTBearRight":
            return "icon-bearright";
        case "esriDMTTurnLeft":
        case "esriDMTSharpLeft":
            return "icon-turnleft";
        case "esriDMTTurnRight":
        case "esriDMTSharpRight":
            return "icon-turnright";
        case "esriDMTUTurn":
            return "icon-uturn";
        case "esriDMTRoundabout":
            return "icon-roundabout";
        case "esriDMTDepart":
            return "icon-start";
        case "esriDMTStop":
            return "icon-stop";

        default:
            return "";
        }

    };

    private _setExtraProperties(dir: SVV.RoutePlanning.ViewDirection): void {
        dir.summary.statistics.forEach((stat: SVV.RoutePlanning.IKeyValuePair) => {
            dir.summary[stat.key] = stat.value;
        });

        // Calculate co2 and cost for a car
        var fuelPrice = 15;
        var petrolCars = 58;
        var dieselCars = 42;

        var emissionParameters = {
            petrolCars: petrolCars,
            dieselCars: dieselCars,
            petrolEmission: 206,
            dieselEmission: 157
        }

        var fuelParameters = {
            petrolCars: petrolCars,
            dieselCars: dieselCars,
            petrolConsumption: 1.17,
            dieselConsumption: 0.75
        }

        var getAverageFuelConsumption = (params) => {
            return ((params.petrolCars * params.petrolConsumption) + (params.dieselCars * params.dieselConsumption)) / 100;
        }

        var getAverageEmissionRate = (params) => {
            return ((params.petrolCars * params.petrolEmission) + (params.dieselCars * params.dieselEmission)) / 100;
        }

        var avgFuelConsumption = getAverageFuelConsumption(fuelParameters);
        var avgEmissionRate = getAverageEmissionRate(emissionParameters);

        var co2 = avgEmissionRate + (avgEmissionRate * (dir.summary.totalLength / 1000));
        var price = fuelPrice + (fuelPrice * avgFuelConsumption * (dir.summary.totalLength / 10000));

        dir.summary.totalCo2 = co2;
        dir.summary.totalCarCost = price;
    }

}


