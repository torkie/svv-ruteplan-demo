import * as L from 'leaflet';
import {AddressItem, Polygon,Value,ViewDirection,ControlWrapper } from './domain';

/* $scope for MapController with extra methods and properties*/
export interface IMapControllerScope extends ng.IScope {
    getLocations(adress: string);
    doRouteCalculation();
    reverseRoute();
    hasBlocks();
    removeBlocks();
    updateMarkers();
    getValue(values : Value[], key : string) : string;
    map: L.Map;
    fromAddress: AddressItem;
    intermediateAddresses: AddressItem[];
    blockedPoints: L.LatLng[];
    blockedAreas : Polygon[];
    toAddress: AddressItem;
    markerLayer: L.LayerGroup;
    routeLayer: L.LayerGroup;
    routeFeatureLayer : L.LayerGroup;
    barrierLayer : L.LayerGroup;
    directions: ViewDirection[];
    contextMenuHandleWindowClicked : any;
    controls : ControlWrapper[];
    contextMenuSetFrom(windowLocation:any);
    contextMenuAddIntermediate(windowLocation:any);
    contextMenuSetTo(windowLocation: any);
    toggleMapControl(ctrl : string);
    contextMenuBlockPoint(windowLocation: any);
    zoomToDirection(routeId :number);
    removeIntermediate(item : AddressItem);
    selectRoute(routeId: string);
    showRoute: any;
    selectedRouteId: string;
    downloadRouteAsKML (routeId : number,$event) : void;
    mouseoverinfo : string;
    weight:  number;
    height: number;
    length: number;
    allowTravelInZeroEmissionZone : boolean;
}