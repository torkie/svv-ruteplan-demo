declare module proj4 {
    export function defs(name : string, def : string);
    //export function proj4(firstProjection : string, secondProection : string, soordinates : number[]) : number[];
    export function transform(source : Proj, dest : Proj, coord : Point) : Point;
    export class Proj {
        constructor(defName : string);
    }

    export function toPoint(arr : number[]) : Point;

    export class Point {
        x : number;
        y: number;
    }
} 