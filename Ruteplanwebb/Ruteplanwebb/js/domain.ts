// todo: decouple from leaflet
///<reference path="../ts/typings/leaflet/leaflet.d.ts"/>

/* Holder for addresses returned from autocomplete*/
class AddressItem {
    name: string;
    location : L.LatLng;
}

class RouteResponseHolder {
    data : RouteResponse;
}

class RouteResponse {
    totalDistance: number;
    totalTravelTime: number;
    routeEnvelope: number[];
}
