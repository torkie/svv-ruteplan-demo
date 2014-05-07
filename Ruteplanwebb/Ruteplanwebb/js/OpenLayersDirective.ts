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
            var mapResolutions = [
                21674.7100160867,
                10837.3550080434,
                5418.67750402168,
                2709.33875201084,
                1354.66937600542,
                677.334688002709,
                338.667344001355,
                169.333672000677,
                84.6668360003387,
                42.3334180001693,
                21.1667090000847,
                10.5833545000423,
                5.29167725002117,
                2.64583862501058,
                1.32291931250529,
                0.661459656252646
            ];

            var layerOptions = {
                type: "jpg",
                isBaseLayer: true
            };

            var layer = new OpenLayers.Layer.ArcGISCache("GeoData",
                "http://svvmapcache.opentns.org/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                layerOptions);

            var map = new OpenLayers.Map("map", {
                projection: new OpenLayers.Projection("EPSG:25833"),
                units: "m",
                tileSize: new OpenLayers.Size(256, 256),
                tileOrigin: new OpenLayers.LonLat(-2500000, 9045984),
                resolutions: mapResolutions,
                maxExtent: new OpenLayers.Bounds(-703779.1632476, 6101556.06812566, 1460982.49960906, 7949325.09699705),
                numZoomLevels: 17
            });

            map.addLayer(layer);

            map.setCenter([2072036.8453137, 3709519.2282618], 12);

            this.map = map;
            scope.map = this.map;
        };
    }

}

svvRuteplanApp.directive("map", () => new OpenLayersDirective());
