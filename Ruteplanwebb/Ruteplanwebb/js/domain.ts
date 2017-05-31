///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>

module SVV.RoutePlanning {

    /* Holder for addresses returned from autocomplete*/
    export class AddressItem {
        constructor(public name: string, public location: OpenLayers.LonLat) {
        }
    }

    export class ControlWrapper {
        constructor(public name: string, public control: OpenLayers.Control) {

        }
    }

    export class Polygon {
        constructor(public points : OpenLayers.LonLat[]) {}
    }

    export class RouteResponse {
        directions: RouteResponseDirection[];
        routes: RouteResponseRoute;
    }

    export class RouteResponseDirection {
        summary: RouteResponseSummary;
        features: RouteResponseDirectionFeature[];
    }

    export class RouteResponseDirectionFeature {
        attributes : RouteResponseDirectionFeatureAttributes;
    }

    export class RouteResponseDirectionFeatureAttributes {
        text : string;
        roadFeatures : RoadFeature[];
        maneuverType : string;
    }

    export class RoadFeature {
        attributeType : string;
        location : Location[];
        values : Value[];
    }

    export class Value {
        key: string;
        value: string;
    }

    export class Location {
        northing : number;
        easting: number;
        SRS : string;
    }

    export class ViewDirection extends RouteResponseDirection {
        TotalTollLarge: number;
        TotalTollSmall: number;
        Bounds: OpenLayers.Bounds;
        routeId : number;
        
    }

    export class ViewDirectionFeature extends RouteResponseDirectionFeature {
        roadCat: string;
        roadNumber: number;
        turnIconClass: string;
    }

    export class RouteResponseRoute {
        features: RouteResponseRouteFeature[];
    }

    export class RouteResponseRouteFeature {
        attributes: Attributes[];
        geometry: OpenLayers.Geometry;
    }

    export class Attributes {

    }


    export class RouteResponseSummary {
        totalDistance: number;
        totalTravelTime: number;
        envelope: Envelope;
    }

    export class Envelope {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    }

    export interface IRoutingService {
        calculateRoute(stops: OpenLayers.LonLat[],
                       callback: SVV.RoutePlanning.IRouteCalculationCallback,
                       blockedPoints? : OpenLayers.LonLat[],
                       blockedAreas? : SVV.RoutePlanning.Polygon[],
        width? : number,
        height?: number,
        length?: number
            );
    }

    export interface IGeoCodeService {
        getLocations(val:string) : ng.IPromise<SVV.RoutePlanning.AddressItem[]>;
    }

    export interface IRouteCalculationCallback {
        (totalBounds : OpenLayers.Bounds, features : RouteResponseRouteFeature[], directions : ViewDirection[]) : void;
    }
}
