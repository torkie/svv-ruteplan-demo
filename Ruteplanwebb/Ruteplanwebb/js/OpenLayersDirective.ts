///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>
///<reference path="app.ts"/>
///<reference path="domain.ts"/>
///<reference path="scopes.ts"/>

class OpenLayersDirective {
    restrict: string;
    replace: boolean;
    map: OpenLayers.Map;
    link: any;

    constructor() {
        this.restrict = "AE";
        this.replace = true;

        OpenLayers.ImgPath = "/lib/openlayers/theme/default/img/";

        this.link = (scope: IMapControllerScope, element: any, attrs: any) => {
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
                tileOrigin: new OpenLayers.LonLat(-2500000, 9045984),
                attribution: 'Kartdata <a href="http://vegvesen.no">Statens Vegvesen</a>, <a href="http://statkart.no">Statens Kartverk</a> og Kommuner'
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

            var markerLayer = new OpenLayers.Layer.Vector("Markers");

            var style = new OpenLayers.Style({
                graphicZIndex: 0,
                strokeOpacity: 0.8,
                strokeColor: "#7777E7",
                strokeWidth: 5
            });

            var linesStyleMap = new OpenLayers.StyleMap({
                "default": style
            });

            var routeLayer = new OpenLayers.Layer.Vector("Route", {
                isBaseLayer: false,
                styleMap: linesStyleMap,
                rendererOptions: {
                    zIndexing: true
                }
            });

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
            map.addLayers([background, routeLayer, markerLayer]);
            map.zoomToExtent(new OpenLayers.Bounds(-241000, 6437500, 1283000, 7961500));

            function onPolygonAdded(evt : any) {
                if (scope.blockedAreas === undefined) {
                    scope.blockedAreas = [];
                }

                var points = [];
                angular.forEach(evt.geometry.components[0].components, (p : OpenLayers.Geometry.Point) => {
                    points.push(new OpenLayers.LonLat(p.x, p.y));
                });

                var poly = new SVV.RoutePlanning.Polygon(points);

                scope.blockedAreas.push(poly);
                scope.toggleMapControl(null);
                scope.updateMarkers();
            }
            var polygonControl = new SVV.RoutePlanning.ControlWrapper('polygon', new OpenLayers.Control.DrawFeature(markerLayer, OpenLayers.Handler.Polygon, {featureAdded : onPolygonAdded}));
            var dfControl = new OpenLayers.Control.DragFeature(markerLayer);
            dfControl.onComplete = (feature: OpenLayers.Feature.Vector, pixel: OpenLayers.Pixel) => {
                if ((<any>feature).onfeaturedragged != null)
                    (<any>feature).onfeaturedragged();
            };
            var dragFeatureControl = new SVV.RoutePlanning.ControlWrapper('dragfeature', dfControl);
            var controls = [polygonControl,dragFeatureControl];
            angular.forEach(controls, (ctrl) => {
                map.addControl(ctrl.control, null);
            });


            var mousePositionCtrl = new OpenLayers.Control.MousePosition({
                    numDigits: 1,
                    separator: ', '
                }
            );
            map.addControl(mousePositionCtrl,null);
            map.events.register('click', map, () => {
                if (scope.contextMenuHandleWindowClicked != null) {
                    scope.contextMenuHandleWindowClicked(map.div);
                }
            },false);

             map.events.register('featureover', map, (e) => {
                    if (e.feature.draggable) {
                        scope.toggleMapControl('dragfeature');
                    };
                });
                 map.events.register('featureout', map, (e) => {
                    if (e.feature.draggable) {
                        scope.toggleMapControl(null);
                    };
                });


            scope.map = map;
            scope.controls = controls;
            scope.markerLayer = markerLayer;
            scope.routeLayer = routeLayer;
        };
    }

}

angular.module("rpwDirectives", [])
    .directive("map", () => new OpenLayersDirective());
