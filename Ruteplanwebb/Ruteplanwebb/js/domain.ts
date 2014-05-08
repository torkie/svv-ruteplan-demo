///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>

/* Holder for addresses returned from autocomplete*/
class AddressItem {
    constructor(public name: string, public location: OpenLayers.LonLat) {
    }
}

class RouteResponseHolder {
    data: RouteResponse;
}

class RouteResponse {
    totalDistance: number;
    totalTravelTime: number;
    routeEnvelope: number[];
}
