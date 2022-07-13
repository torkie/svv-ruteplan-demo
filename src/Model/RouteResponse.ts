export interface RouteResponse {
    directions: RouteResponseDirection[];
    routes: RouteResponseRoute;
}

export interface RouteResponseDirection {
    summary: RouteResponseSummary;
    features: RouteResponseDirectionFeature[];
}

export interface RouteResponseDirectionFeature {
    attributes : RouteResponseDirectionFeatureAttributes;
}

export interface RouteResponseDirectionFeatureAttributes {
    text : string;
    roadFeatures : RoadFeature[];
    maneuverType : string;
}

export interface RoadFeature {
    attributeType : string;
    location : Location[];
    values : Value[];
    distanceAlongSegment : number;
}

export interface Value {
    key: string;
    value: string;
}

export interface Location {
    northing : number;
    easting: number;
    srs : string;
}

export class RouteResponseRoute {
    features: RouteResponseRouteFeature[];
}

export class RouteResponseRouteFeature {
    attributes: { [key: string] : any};
    geometry: Geometry;
}


export interface RouteResponseSummary {
    totalLength: number;
    totalDriveTime: number;
    envelope: Envelope;
}

export interface Envelope {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}


export interface Geometry {
    paths: number[][][];
}

export interface ViewDirection extends RouteResponseDirection {
    TotalTollLarge: number;
    TotalTollSmall: number;
    TotalTollLargeWithoutDiscount: number;
    TotalTollSmallWithoutDiscount: number;
    Bounds: L.LatLngBounds;
    routeId : number;
    routeName : string;    
}

export interface ViewDirectionFeature extends RouteResponseDirectionFeature {
    roadCat: string;
    roadNumber: number;
    turnIconClass: string;
    compressedGeometry: string;
    roadCamera:RoadFeature[];
    datex3TrafficMessage : RoadFeature[];
}