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
    fromAddress: SVV.RutePlan.AddressItem;
    intermediateAddresses: SVV.RutePlan.AddressItem[];
    toAddress: SVV.RutePlan.AddressItem;
    markerLayer: OpenLayers.Layer.Markers;
    routeLayer: OpenLayers.Layer.Vector;
    directions: SVV.RutePlan.ViewDirection[];
    contextMenuHandleWindowClicked : any;
    contextMenuSetFrom(windowLocation:any);
    contextMenuAddIntermediate(windowLocation:any);
    contextMenuSetTo(windowLocation: any);
    zoomToDirection(routeId :number);
    removeIntermediate(item : SVV.RutePlan.AddressItem);
    selectRoute: any;
    showRoute: any;
    selectedRouteId: number;
}
