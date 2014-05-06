///<reference path="leaflet.d.ts"/>

declare module L.AwesomeMarkers {
    export function icon(options : any) : Icon;

    export class Icon extends L.Icon {
        icon: string;
        prefix: string;
        markerColor: string;
        iconColor: string;
        spin: boolean;
        extraClasses: string;
    }
}