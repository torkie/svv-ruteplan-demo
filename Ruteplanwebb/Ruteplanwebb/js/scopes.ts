///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="domain.ts"/>

/* $scope for MapController with extra methods and properties*/
interface IMapControllerScope extends ng.IScope {
    getLocations(adress: string);
    doRouteCalculation();
    updateMarkers();
    map: OpenLayers.Map;
    fromAddress: AddressItem;
    toAddress: AddressItem;
    markerLayer: OpenLayers.Layer.Markers;
    routeLayer: OpenLayers.Layer.Vector;
    directions: any;
    contextMenuHandleWindowClicked : any;
    contextMenuSetFrom(windowLocation:any);
    contextMenuSetTo(windowLocation: any);
    selectRoute: any;
    showRoute: any;
    selectedRouteId: any;
}
