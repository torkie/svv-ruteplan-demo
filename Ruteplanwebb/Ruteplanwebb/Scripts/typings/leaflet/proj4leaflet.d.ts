///<reference path="leaflet.d.ts"/>

declare module L.Proj {
    export class CRS implements L.ICRS {
        constructor(name: string, proj4Str: string, options: any);

        projection: L.IProjection;
        transformation: L.Transformation;
        code: string;

        pointToLatLng(point: L.Point, zoom: number): L.LatLng;
        latLngToPoint(latlng: L.LatLng, zoom : number) : L.Point;

        project(latlng: L.LatLng): L.Point;

        scale(zoom: number): number;

        getSize(zoom: number): L.Point;
    }
}