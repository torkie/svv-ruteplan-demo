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

        OpenLayers.ImgPath = "/lib/openlayers/img/";

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
                attribution: '&copy; NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)'
            };

            var background = new OpenLayers.Layer.ArcGISCache("GeocacheTrafikk",
                [
                    "https://m1-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "https://m2-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "https://m3-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "https://m4-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "https://m5-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "https://m6-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "https://m7-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "https://m8-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer",
                    "https://m9-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer"
                ],
                layerOptions
            );

            var markerLayer = new OpenLayers.Layer.Vector("Markers");
            var barrierLayer = new OpenLayers.Layer.Vector("Barriers");
            var routeFeatureLayer = new OpenLayers.Layer.Vector("RouteFeatures", {
                maxScale:  50
            });

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
                projection: new OpenLayers.Projection("EPSG:32633"),
                units: "m",
                maxExtent: mapExt,
                controls: [
                    new OpenLayers.Control.Attribution(),
                    new OpenLayers.Control.Navigation(),
                    new OpenLayers.Control.Zoom()
                ]
            };

            var map = new OpenLayers.Map("map", mapOptions);
            map.addLayers([background, routeLayer, routeFeatureLayer, markerLayer, barrierLayer]);
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

                //Turn on drag-feature again...
                scope.toggleMapControl('dragfeature');
                scope.updateMarkers();
            }
            var polygonControl = new SVV.RoutePlanning.ControlWrapper('polygon', new OpenLayers.Control.DrawFeature(barrierLayer, OpenLayers.Handler.Polygon, {featureAdded : onPolygonAdded}));
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

            dfControl.activate();
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

            // Feature highlight

            function onFeatureOver(evt : any) {
                
                var feature = evt.feature;
                if (feature["html"] != undefined && feature["html"].length > 0) {
                    scope.mouseoverinfo = feature["html"];
                    scope.$apply();

                }
            }

            function onFeatureOut (evt : any) {
                if (evt.feature["html"] != undefined && evt.feature["html"].length > 0) {
                    scope.mouseoverinfo = null;
                    scope.$apply();
                }
            }

            map.events.register("featureover", map, onFeatureOver);
            map.events.register("featureout", map, onFeatureOut);

            scope.map = map;
            scope.controls = controls;
            scope.markerLayer = markerLayer;
            scope.routeLayer = routeLayer;
            scope.routeFeatureLayer = routeFeatureLayer;
            scope.barrierLayer = barrierLayer;
        };
    }

}

angular.module("rpwDirectives", [])
    .directive("map", () => new OpenLayersDirective());
