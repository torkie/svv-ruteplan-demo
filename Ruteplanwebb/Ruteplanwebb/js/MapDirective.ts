///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/leaflet/leaflet.d.ts"/>
///<reference path="../ts/typings/leaflet/esri-leaflet.d.ts"/>
///<reference path="../ts/typings/leaflet/leaflet-mouseposition.d.ts"/>
///<reference path="../ts/typings/leaflet/proj4leaflet.d.ts"/>
///<reference path="../ts/typings/leaflet/leaflet.awesome-markers.d.ts"/>
///<reference path="app.ts"/>
///<reference path="domain.ts"/>

/* AngularDirective for &lt;map&gt; that displays an leaflet map*/
class MapDirective {
    restrict: string;
    replace: boolean;
    template: string;
    link: any;
    map: L.Map;
    markers: L.Marker[];

    constructor() {
        L.Icon.Default.imagePath = 'lib/leaflet/images/';
        this.restrict = 'E';
        this.replace = true;
        this.template = '<div pointsource="markerPoints"></div>';

        var crs = new L.Proj.CRS('EPSG:25833',
            '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
            {
                transformation: new L.Transformation(1, 2500000, -1, 9045984),
                resolutions: [
                    21674.7100160867,
                    10837.35500804335,
                    5418.677504021675,
                    2709.3387520108377,
                    1354.6693760054188,
                    677.3346880027094,
                    338.6673440013547,
                    169.33367200067735,
                    84.66683600033868,
                    42.33341800016934,
                    21.16670900008467,
                    10.583354500042335,
                    5.291677250021167,
                    2.6458386250105836,
                    1.3229193125052918,
                    0.6614596562526459,
                    0.33072982812632296
                ]
            }
            );

        this.link = function (scope: any, element: any, attrs: any) {

            this.map = new L.Map('map', {
                center: new L.LatLng(59.95501, 10.71167),
                continuousWorld: true,
                worldCopyJump: false,
                zoom: 8,
                crs: crs
            });

            scope.map = this.map;

            var tilesAttrib = 'Kartdata <a href="http://vegvesen.no">Statens Vegvesen</a>, <a href="http://statkart.no">Statens Kartverk</a> og Kommuner';
            var tileLayer = new L.esri.TiledMapLayer("http://svvmapcache.opentns.org/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer", { attribution: tilesAttrib });

            tileLayer.addTo(this.map);

            var mousePos = new L.Control.MousePosition({ numDigits: 1 });
            mousePos.addTo(this.map);
            var localMap = this.map;

            function updatePoints(value: SVV.RoutePlanning.AddressItem[]): void {
                if (this.markers != null) {
                    angular.forEach(this.markers, item => {
                        localMap.removeLayer(item);
                    });
                }
                this.markers = new Array<L.Marker>();
                var localMarkers = this.markers;
                angular.forEach(value, item => {

                    var icon = null;
                    if (localMarkers.length == 0) {
                        icon = L.AwesomeMarkers.icon({
                            icon: 'play',
                            markerColor: 'green',
                            prefix: 'fa'
                        });
                    }
                    else if (localMarkers.length == value.length - 1 && value.length > 1) {
                        icon = L.AwesomeMarkers.icon({
                            icon: 'stop',
                            markerColor: 'red',
                            prefix: 'fa'
                        });
                    }
                    var m = L.marker(item.location, { icon: icon });
                    localMarkers.push(m);
                    m.addTo(localMap);
                });
            }

            scope.$watch(attrs.pointsource, (value) => {
                updatePoints(value);
            });

        }
    }
} 

//svvRuteplanApp.directive('map', () => new MapDirective());
