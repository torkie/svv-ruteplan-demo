///<reference path="leaflet.d.ts"/>

declare module L.esri {
    export class TiledMapLayer extends TileLayer {
        constructor(url: string, options: any);
    }
}