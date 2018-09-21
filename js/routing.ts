import * as angular from 'angular';
import {ViewDirection,IRoutingService,IRouteCalculationCallback, Polygon,ViewDirectionFeature, RouteResponse, RouteResponseRouteFeature} from './domain';
import * as L from 'leaflet';
import 'proj4leaflet';
import { geom } from '../node_modules/@types/openlayers/index';


angular.module("routing", ["rpwSettings"])
    .factory("routingService", ($http : angular.IHttpService, settings) => new RoutingService($http, settings));

class RoutingService implements IRoutingService {

    private projection : L.Projection;

    constructor(private $http: ng.IHttpService, private settings: any) {
        this.projection =  new L.Proj.CRS("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs").projection;

    }

    calculateRoute = (stops: L.Point[], callback: IRouteCalculationCallback, blockedPoints?: L.Point[], blockedAreas?: Polygon[], weight? : number, height? : number, length? : number, allowTravelInZeroEmissionZone? : boolean) => {
        var strings = [];
        angular.forEach(stops, (stop) => {
            strings.push(stop.x + "," + stop.y);
        });
        var stopsParameter = strings.join(";");

        strings = [];
        if (blockedPoints != undefined) {
            angular.forEach(blockedPoints, (p) => {
                strings.push(p.x + "," + p.y);
            });
        }
        var pointBarriersParameter = strings.join(";");

        strings = [];

        var useProxy = this.settings.useproxy || this.settings.username;

        var url = useProxy ? 'routingService' : this.settings.url;
        var params = <any>{
            stops: stopsParameter,
            barriers: pointBarriersParameter,
            format: "json",
            lang: "nb-no"
        };

        if (useProxy) {
            params.backend_url = this.settings.url;
            params.backend_username = this.settings.username;
            params.backend_password = this.settings.password;
        }
        if (this.settings.routetype && this.settings.routetype.length > 0)
            params.route_type = this.settings.routetype;
        if (weight)
            params.weight = weight;
        if (height)
            params.height = height;
        if (length)
            params.length = length;

        params.allowTravelInZeroEmissionZone = allowTravelInZeroEmissionZone;

    this.$http.get(url, {
            params: params
        }).then((resp: angular.IHttpResponse<RouteResponse>) => {
            var forEach = angular.forEach;
            var data = resp.data;
            // create geometry features from routes
            var features = [];
            forEach(data.routes.features, route => {
                var components = [];
                forEach(route.geometry.paths, path => {
                    var points = [];
                    forEach(path, point => {
                        points.push(this.projection.unproject(new L.Point(<number>point[0], <number>point[1])));
                    });
                    components.push(points);
                });
                var geometry = new L.Polyline(components);
                features.push({geometry: geometry});
            });

            // calculate bounding box for all routes
            var totalBounds = null;
            var directions = <ViewDirection[]>data.directions;
            for (var i = 0; i < directions.length; i++) {
                forEach(directions[i].features, (feature: ViewDirectionFeature) => {
                    if (feature.attributes.text.match(/\{([ERFKPS])(\d+)\}.*/i)) {
                        feature.roadCat = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$1");
                        feature.roadNumber = parseInt(feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$2"));
                        feature.attributes.text = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\} (.*)/i, "$3");
                    }
                    
                    feature.turnIconClass = this.getTurnIconForEsriManeuvre(feature.attributes.maneuverType);

                });
                directions[i].TotalTollLarge = data.routes.features[i].attributes["Total_Toll large"];
                directions[i].TotalTollSmall = data.routes.features[i].attributes["Total_Toll small"];
                directions[i].TotalTollLargeWithoutDiscount = data.routes.features[i].attributes["Total_Toll_Without_Discount large"];
                directions[i].TotalTollSmallWithoutDiscount = data.routes.features[i].attributes["Total_Toll_Without_Discount small"];
                //Unpack additional attributes
                if ((<any>data.routes.features[i].attributes).attributes) {
                    forEach((<any>data.routes.features[i].attributes).attributes,
                        (kvp) => {
                            (<any>directions[i].summary).statistics[kvp.key] = kvp.value;
                        });
                }
                var bbox = directions[i].summary.envelope;
                directions[i].Bounds = new L.LatLngBounds(this.projection.unproject(new L.Point(bbox.xmin, bbox.ymin)), this.projection.unproject(new L.Point(bbox.xmax,bbox.ymax)));

                if (totalBounds == null) {
                    totalBounds = directions[i].Bounds;
                } else {
                    totalBounds.extend(directions[i].Bounds);
                }

                features[i].geometry.options.routeId = directions[i].routeId;
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

}


