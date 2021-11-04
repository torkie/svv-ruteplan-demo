import * as L from 'leaflet';
import * as angular from 'angular';
import './domain';
import {IMapControllerScope} from './scopes';
import 'proj4leaflet';

class LeafLetDirective {
    restrict: string;
    replace: boolean;
    map: L.Map;
    link: any;

    constructor() {
        this.restrict = "AE";
        this.replace = true;

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

            var crs = new L.Proj.CRS("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs", { resolutions: mapResolutions,
                //origin: [-3708422.0277, 10155660.624000002]
                origin: [-2500000.0, 9045984.0]
                            }
                                );

            this.map = L.map(element[0].id, <any>{
                crs: crs,
                contextmenu: true,
                contextmenuWidth: 140,
                contextmenuItems: [{
                    text: '<i class="fa fa-play" style="color: green;margin-right: 5px"></i> Sett startpunkt',
                    callback: scope.contextMenuSetFrom
                }, {
                    text: '<i class="fa fa-pause" style="color: rgb(238,146,46); margin-right: 5px"></i> Legg til viapunkt', callback: scope.contextMenuAddIntermediate
                    
                }, {
                    text: '<i class="fa fa-stop" style="color: red;margin-right: 5px"></i> Sett Sluttpunkt',
                    callback: scope.contextMenuSetTo
                }, '-', {
                    text: 'Blokker punkt',
                    
                    callback: scope.contextMenuBlockPoint
                }]
            });
            L.tileLayer('https://nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}', {
                subdomains: "123456789",
                attribution: '&copy; NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)',
                noWrap: true,
                continuousWorld: true,
                maxZoom: (<any>crs).options.resolutions.length,
                minZoom: 0
            }).addTo(this.map);


            var ferryLayer = new (<any>L.GeoJSON).AJAX("http://multirit.triona.se/tables/ferrypoints.json", {
                pointToLayer: (feature, latlng) => {
                    let myIcon = L.icon({
                        iconUrl: 'images/ferry-icon.png',
                        iconSize:     [10,10], // width and height of the image in pixels
                        iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
                      });
                      var f = L.marker(latlng, { icon: myIcon, opacity: 0.5 });
                      f.on("click", (e : MouseEvent) => {
                            scope.openFerryPopup("Ferry", feature.properties.route1);
                        });
                      return f;
                    }
            });
            ferryLayer.addTo(this.map);



            (<any>L.Control).mouseposition({position: "bottomleft"}).addTo(this.map);

            this.map.setView([60.877003, 8.903530], 4);
            
            
        
            var markerLayer = new L.LayerGroup();
            markerLayer.addTo(this.map);
            var barrierLayer = new L.LayerGroup();
            barrierLayer.addTo(this.map);
            var routeLayer = new L.LayerGroup();
            routeLayer.addTo(this.map);
            var routeFeatureLayer = new L.LayerGroup();
            routeFeatureLayer.addTo(this.map);

            scope.map = this.map;
            scope.markerLayer = markerLayer;
            scope.routeLayer = routeLayer;
            scope.routeFeatureLayer = routeFeatureLayer;
            scope.barrierLayer = barrierLayer;

            this.map.on('click', () => {
                if (scope.contextMenuHandleWindowClicked != null) {
                    scope.contextMenuHandleWindowClicked((<any>this.map).mapPane);
                }
            });

            return;
            /*
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
            */
        };
    }

}

angular.module("rpwDirectives", [])
    .directive("lmap", () => new LeafLetDirective());
