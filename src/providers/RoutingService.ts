import { AddressItem } from "../Model/AddressItem";
import {AxiosResponse} from "axios";
import Axios from "axios";
import {RouteResponse, ViewDirection, ViewDirectionFeature} from "../Model/RouteResponse";
import * as L from "leaflet";
import { string } from "prop-types";
import { IParameter } from "../components/Parameter";

export interface IRoutingService {
    calculateRoute(from: AddressItem, to : AddressItem, via: AddressItem[], blockedPoints: L.LatLng[], blockedAreas?: L.Polygon[],
        weight?: number, length?: number, height?: number, allowTravelInZeroEmissionZone?: boolean, parameters?:IParameter[],
        avoidMessagesOfType?: string[]) : Promise<IRouteResponse>;
}

export interface IRouteResponse {
    directions: ViewDirection[];
    features: Feature[];
    bounds: L.LatLngBounds;
}

export interface Feature{
    geometry: L.Polyline;
}


export default class RoutingService implements IRoutingService  {

    private projection : L.Projection;

    constructor(private url: string, private routeType : string)
    {
        this.projection =  new L.Proj.CRS("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs").projection;
    }

    calculateRoute(from: AddressItem, to: AddressItem, via: AddressItem[], blockedPoints: L.LatLng[], blockedAreas?: L.Polygon[],
        weight?: number, length?: number, height?: number, allowTravelInZeroEmissionZone?: boolean,parameters?:IParameter[],
        avoidMessagesOfType?: string[]) : Promise<IRouteResponse> {
        let strings = [] as string[];
        
        var fromPt = this.projection.project(from.location);
        strings.push(fromPt.x + "," + fromPt.y);

        console.log(parameters);
        //Intermediate locatiosn
        if (via != null)
        {
            via.forEach((via) => {
                if (via != null)
                {
                    var viaPt = this.projection.project(via.location);
                    strings.push(viaPt.x + "," + viaPt.y);
                }
            });
        }

        var toPt = this.projection.project(to.location);
        strings.push(toPt.x + "," + toPt.y);
        
        var stopsParameter = strings.join(";");

        strings = [];
        if (blockedPoints != undefined) {
            blockedPoints.forEach((p) => {
                var pt = this.projection.project(p);
                strings.push(pt.x + "," + pt.y);
            });
        }
        var pointBarriersParameter = strings.join(";");

        strings = [];

        var params = <any>{
            stops: stopsParameter,
            barriers: pointBarriersParameter,
            format: "json",
            lang: "nb-no"
        };

        if (this.routeType && this.routeType.length > 0)
            params.route_type = this.routeType;

        if (weight)
            params.weight = weight;
        if (height)
            params.height = height;
        if (length)
            params.length = length;


            parameters.forEach((parameter : IParameter)  => {

                if(parameter.key !== '' && parameter.value !=''){
                    
                    const value = parameter.value;
                    params[parameter.key] = value;
                }
                
            });
        


        if (!allowTravelInZeroEmissionZone)
        {
            params.allowTravelInZeroEmissionZone=false;
        }

        return Axios.get(this.url, {
            params: params
        }).then((resp: AxiosResponse<RouteResponse>) => {
            var data = resp.data;
            
            // create geometry features from routes
            var features : { geometry: L.Polyline}[] = [];
            if (data.routes == null)
            {
                alert("Could not calculate a route! Try move start/end point");
                return null;
            }
            data.routes.features.forEach(route => {
                var components = [] as L.LatLng[][];
                route.geometry.paths.forEach(path => {
                    var points = [] as L.LatLng[];
                    path.forEach(point => {
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
                directions[i].features.forEach((feature: ViewDirectionFeature) => {
                    if (feature.attributes.text.match(/\{([ERFKPS])(\d+)\}.*/i)) {
                        feature.roadCat = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$1");
                        feature.roadNumber = parseInt(feature.attributes.text.replace(/\{([ERFKPS])(\d+)\}.*/i, "$2"));
                        feature.attributes.text = feature.attributes.text.replace(/\{([ERFKPS])(\d+)\} (.*)/i, "$3");
                    }
                    
                    feature.turnIconClass = this.getTurnIconForEsriManeuvre(feature.attributes.maneuverType);

                });
                directions[i].TotalTollLarge = data.routes.features[i].attributes['Total_Toll large'];
                directions[i].TotalTollSmall = data.routes.features[i].attributes["Total_Toll small"];
                directions[i].TotalTollLargeWithoutDiscount = data.routes.features[i].attributes["Total_Toll_Without_Discount large"];
                directions[i].TotalTollSmallWithoutDiscount = data.routes.features[i].attributes["Total_Toll_Without_Discount small"];
                //Unpack additional attributes
                if ((<any>data.routes.features[i].attributes).attributes) {
                    (<any>data.routes.features[i].attributes).attributes.forEach((kvp : any) => {
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

                (features[i].geometry.options as any).routeId = directions[i].routeId;
            }

            return {features: features, directions: directions, bounds: totalBounds};
        });
    }

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