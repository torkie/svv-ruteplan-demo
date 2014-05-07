///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="app.ts"/>
///<reference path="domain.ts"/>

class OpenLayersDirective {
    restrict: string;
    replace: boolean;
    map: OpenLayers.Map;
    link: any;

    constructor() {
        this.restrict = "E";
        this.replace = true;

        this.link = function(scope: any, element: any, attrs: any) {
            this.map = new OpenLayers.Map("map");
            this.map.addLayer(new OpenLayers.Layer.OSM());
            this.map.zoomToMaxExtent();
            scope.map = this.map;
        };
    }

}

svvRuteplanApp.directive("map", () => new OpenLayersDirective());
