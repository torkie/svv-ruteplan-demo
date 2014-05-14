///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>

module SVV.RutePlan {

    /* Holder for addresses returned from autocomplete*/
    export class AddressItem {
        constructor(public name: string, public location: OpenLayers.LonLat) {
        }
    }

    export class RouteResponse {
        directions: RouteResponseDirection[];
        routes: RouteResponseRoute;
    }

    export class RouteResponseDirection {
        summary: RouteResponseSummary;
    }

    export class ViewDirection extends RouteResponseDirection {
        TotalTollLarge: number;
        TotalTollSmall: number;
        Bounds: OpenLayers.Bounds;
        routeId : number;
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

    export interface IRouteCalculationCallback {
        (totalBounds : OpenLayers.Bounds, features : RouteResponseRouteFeature[], directions : ViewDirection[]) : void;
    }
}
