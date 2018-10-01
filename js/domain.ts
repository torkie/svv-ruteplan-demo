import { LatLngBounds, LatLng, Point } from 'leaflet';


    export class Geometry {
        paths: number[][][];
    }

    /* Holder for addresses returned from autocomplete*/
    export class AddressItem {
        constructor(public name: string, public location: LatLng) {
        }
    }

    export class ControlWrapper {
        constructor(public name: string, public control: any) {

        }
    }

    export class Polygon {
        constructor(public points : LatLng[]) {}
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
        TotalTollLargeWithoutDiscount: number;
        TotalTollSmallWithoutDiscount: number;
        Bounds: LatLngBounds;
        routeId : string;
        
    }

    export class ViewDirectionFeature extends RouteResponseDirectionFeature {
        roadCat: string;
        roadNumber: number;
        turnIconClass: string;
        compressedGeometry: string;
    }

    export class RouteResponseRoute {
        features: RouteResponseRouteFeature[];
    }

    export class RouteResponseRouteFeature {
        attributes: Attributes[];
        geometry: Geometry;
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
        calculateRoute(stops: Point[],
                       callback: IRouteCalculationCallback,
                       blockedPoints? : Point[],
                       blockedAreas? : Polygon[],
        width? : number,
        height?: number,
        length?: number,
        allowTravelInZeroEmissionZone? : boolean,
        avoidMessagesOfType?: string[]
            );
    }

    export interface IGeoCodeService {
        getLocations(val:string) : ng.IPromise<AddressItem[]>;
    }

    export interface IRouteCalculationCallback {
        (totalBounds : LatLngBounds, features : {geometry: L.Polyline}[], directions : ViewDirection[]) : void;
    }
