///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="domain.ts"/>

/* $scope for MapController with extra methods and properties*/
interface IMapControllerScope extends ng.IScope {
    getLocations(adress: string);
    doRouteCalculation();
    reverseRoute();
    updateMarkers();
    map: OpenLayers.Map;
    fromAddress: SVV.RoutePlanning.AddressItem;
    intermediateAddresses: SVV.RoutePlanning.AddressItem[];
    blockedPoints: OpenLayers.Geometry.Point[];
    blockedAreas : OpenLayers.Geometry.Collection[];
    toAddress: SVV.RoutePlanning.AddressItem;
    markerLayer: OpenLayers.Layer.Vector;
    routeLayer: OpenLayers.Layer.Vector;
    directions: SVV.RoutePlanning.ViewDirection[];
    contextMenuHandleWindowClicked : any;
    controls : SVV.RoutePlanning.ControlWrapper[];
    contextMenuSetFrom(windowLocation:any);
    contextMenuAddIntermediate(windowLocation:any);
    contextMenuSetTo(windowLocation: any);
    toggleMapControl(ctrl : string);
    zoomToDirection(routeId :number);
    removeIntermediate(item : SVV.RoutePlanning.AddressItem);
    selectRoute: any;
    showRoute: any;
    selectedRouteId: number;
}
