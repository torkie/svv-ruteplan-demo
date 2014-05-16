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
    }

    export class RouteResponseRoute {
        features: RouteResponseRouteFeature[];
    }

    export class RouteResponseRouteFeature {
        attributes: Attributes[];
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
        calculateRoute(stops: OpenLayers.LonLat[], callback: SVV.RoutePlanning.IRouteCalculationCallback, blockedPoints? : OpenLayers.LonLat[]);
    }

    export interface IGeoCodeService {
        getLocations(val:string) : ng.IPromise<SVV.RoutePlanning.AddressItem[]>;
    }

    export interface IRouteCalculationCallback {
        (totalBounds : OpenLayers.Bounds, features : RouteResponseRouteFeature[], directions : ViewDirection[]) : void;
    }
}
