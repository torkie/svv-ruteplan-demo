///<reference path="../../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../app.ts"/>
///<reference path="../domain.ts"/>
///<reference path="../scopes.ts"/>
///<reference path="../helpers/CompressedGeometryHelper.ts"/>

class ChartDirective {
    restrict: string;
    replace: boolean;
    link: any;

    private _scope: any;
    private _directions: SVV.RoutePlanning.ViewDirection[];
    private _geometryHelper: SVV.RoutePlanning.Helpers.CompressedGeometryHelper;
    private _firstCall = true;


    constructor() {
        this.restrict = "AE";
        this.replace = true;
        
        this.link = (scope: any, element: any, attrs: any) => {
            this._scope = scope;
            this._geometryHelper = new SVV.RoutePlanning.Helpers.CompressedGeometryHelper();

            this._scope.chartIsVisible = false;

            scope.closeChart = () => {
                scope.chartIsVisible = false;
            };

            scope.$watch(attrs.route, (value: SVV.RoutePlanning.ViewDirection[]) => {
                if (value != null) {
                    this._directions = value;
                    if (this._firstCall && SVV.RoutePlanning.AppConfig.showChartOnFirsRoute) {
                        this._firstCall = false;
                        setTimeout(() => {
                            this._scope.$apply(() => {
                                this._scope.chartIsVisible = true;
                            });
                            
                        }, 500);
                        
                    }
                    else if (scope.chartIsVisible == true) {
                        this._updateChart();
                    }
                }
            });

            scope.$watch('chartIsVisible', () => {
                if (scope.chartIsVisible == true) {
                    this._updateChart();
                }
            });
        };
    }

    private _updateChart() {
        if (this._directions == null) {
            return;
        }

        var minZ = Number.MAX_VALUE;
        var maxZ = Number.MIN_VALUE;

        var data = [];
        var geometryHelper = SVV.RoutePlanning.Helpers.CompressedGeometryHelper;
        var totalLength = 0;
        this._directions.forEach((direction: SVV.RoutePlanning.ViewDirection) => {

            direction.features.forEach((feature) => {
                var partLength = totalLength;

                // Extract geometry (xyz)
                var points: SVV.RoutePlanning.Helpers.Xyz[] = <any>geometryHelper.extractPointsFromCompressedGeometry(feature.compressedGeometry);

                if (points.length > 0) {
                    data.push({ x: Math.floor(partLength), value: points[0].z, otherValue: points[0].z });
                }
                var current: SVV.RoutePlanning.Helpers.Xyz;
                var prev: SVV.RoutePlanning.Helpers.Xyz;
                for (var i = 1; i < points.length; i++) {
                    current = points[i];
                    prev = points[i - 1];
                    var segmentLength = Math.sqrt(Math.pow(current.x - prev.x, 2) + Math.pow(current.y - prev.y, 2));
                    partLength += segmentLength;

                    if (current.z < minZ) {
                        minZ = current.z;
                    }
                    else if (current.z > maxZ) {
                        maxZ = current.z;
                    }

                    data.push({ x: Math.floor(partLength), value: current.z, otherValue: current.z});
                }

                totalLength += feature.attributes.length * 1000;
            });
        });

        this._scope.chartConfig = {
            axes: {
                x: {
                    key: 'x', type: 'linear',
                    labelFunction: (value) => {
                        return value + " m";
                    }, min: 0, max: totalLength
                },
                y: { type: 'linear', min: minZ, max: maxZ }
            },
            series: [
                { y: 'value', color: 'lightsteelblue', thickness: '2px', type: 'line', striped: true, drawDots: false, label: 'meter over havet' }
            ],
            tooltip: {
                mode: "scrubber",
                interpolate: false,
                formatter: (x, y) => {
                    return y + " m.o.h.";
                }
            },
            lineMode: 'linear',
            tension: 70,
            drawLegend: true,
            drawDots: true,
            columnsHGap: 5
        };

        this._scope.chartData = data;
    }
}


var rpwDirectives = rpwDirectives || {};

var mod: ng.IModule;
if (rpwDirectives.hasOwnProperty("module")) {
    mod = rpwDirectives["module"];
}
else {
    mod = angular.module("rpwDirectives", []);
    rpwDirectives["module"] = mod;
}
mod.directive("chart", () => new ChartDirective());