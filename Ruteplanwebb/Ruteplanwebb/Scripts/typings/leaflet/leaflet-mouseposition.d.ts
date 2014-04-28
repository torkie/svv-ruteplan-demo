///<reference path="leaflet.d.ts"/>
declare module L.Control {
    export class MousePosition
    {
        constructor();
        constructor(options: any);
        addTo(map: L.Map);
        position : string;
    }

}
