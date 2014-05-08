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

        OpenLayers.ImgPath = "/lib/openlayers/theme/default/img/";

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

            var mapExt = new OpenLayers.Bounds(-2500000, 3500000, 3045984, 9045984);

            var layerOptions = {
                type: "jpg",
                resolutions: mapResolutions,
                maxExtent: mapExt,
                tileOrigin: new OpenLayers.LonLat(-2500000, 9045984)
            };

            var background = new OpenLayers.Layer.ArcGISCache("GeocacheTrafikk",
                [
                    "http://m1.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "http://m2.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "http://m3.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "http://m4.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "http://m5.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "http://m6.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "http://m7.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "http://m8.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "http://m9.nvdbcache.geodataonline.no/ArcGIS/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer"
                ],
                layerOptions
            );

            var markers = new OpenLayers.Layer.Markers("Markers");

            var mapOptions = {
                theme: null,
                projection: new OpenLayers.Projection("EPSG:25833"),
                units: "m",
                maxExtent: mapExt,
                controls: [
                    new OpenLayers.Control.Attribution(),
                    new OpenLayers.Control.Navigation(),
                    new OpenLayers.Control.Zoom()
                ]
            };

            var map = new OpenLayers.Map("map", mapOptions);
            map.addLayers([background, markers]);
            map.zoomToExtent(new OpenLayers.Bounds(-241000, 6437500, 1283000, 7961500));

            this.map = map;
            scope.map = this.map;
            scope.markers = markers;
        };
    }

}

svvRuteplanApp.directive("map", () => new OpenLayersDirective());