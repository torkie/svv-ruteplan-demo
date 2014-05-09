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
    markers: OpenLayers.Layer.Markers;
}
