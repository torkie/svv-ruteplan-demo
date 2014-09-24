///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="domain.ts"/>

/* $scope for MapController with extra methods and properties*/
interface IMapControllerScope extends ng.IScope {
    getLocations(adress: string);
    doRouteCalculation();
    reverseRoute();
    hasBlocks();
    removeBlocks();
    updateMarkers();
    getValue(values : SVV.RoutePlanning.Value[], key : string) : string;
    map: OpenLayers.Map;
    intermediateAddresses: SVV.RoutePlanning.AddressItem[];
    blockedPoints: OpenLayers.LonLat[];
    blockedAreas : SVV.RoutePlanning.Polygon[];
    markerLayer: OpenLayers.Layer.Vector;
    routeLayer: OpenLayers.Layer.Vector;
    routeFeatureLayer : OpenLayers.Layer.Vector;
    barrierLayer : OpenLayers.Layer.Vector;
    directions: SVV.RoutePlanning.ViewDirection[];
    features: SVV.RoutePlanning.RouteResponseRouteFeature[];
    selectedDirection: SVV.RoutePlanning.ViewDirection;
    contextMenuHandleWindowClicked : any;
    controls : SVV.RoutePlanning.ControlWrapper[];
    contextMenuSetFrom(windowLocation:any);
    contextMenuAddIntermediate(windowLocation:any);
    contextMenuSetTo(windowLocation: any);
    toggleMapControl(ctrl : string);
    contextMenuBlockPoint(windowLocation: any);
    zoomToDirection(routeId :number);
    removeIntermediate(item : SVV.RoutePlanning.AddressItem);
    selectRoute(routeId: number);
    showRoute: any;
    selectedRouteId: number;
    downloadRouteAsKML (routeId : number,$event) : void;
    mouseoverinfo: string;
    title: string;
    getContentHeight(idx: number);
    accordionPanes: boolean[];
    addresses: { fromAddress: SVV.RoutePlanning.AddressItem; toAddress: SVV.RoutePlanning.AddressItem };
    routeSettings: { powerEffort: number; bikePathUsage: number; powerEffortMin: string; powerEffortMax: string; bikePathUsageMin: string; bikePathUsageMax: string;}
    showReportDialog();
    showAboutDialog();
    showChart();
    getPowerEffortValues(val: string);
    getBikePathUsageValues(val: string);
    chartIsVisible: boolean;
}
