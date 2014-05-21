///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>

angular.module("rpwWms", [])
    .controller("WmsController", ["$scope", "$modal", "wmsSettings", function($scope, $modal, wmsSettings) {

        var dialogController = function($scope, $modalInstance, data) {
            $scope.data = data;

            $scope.ok = function() {
                $modalInstance.close($scope.data);
            };

            $scope.cancel = function() {
                $modalInstance.dismiss("cancel");
            };

        };

        $scope.open = function(size) {
            var modalInstance = $modal.open({
                templateUrl: "wms.html",
                controller: dialogController,
                size: size,
                resolve: {
                    data: function() {
                        return wmsSettings;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                wmsSettings.apply();
            });
        };

    }])
    .factory("wmsSettings", function($rootScope) {
        var settings = settings || {};

        var wms = new OpenLayers.Layer.WMS("test", "http://trip.triona.no:80/geoserver/wms", {
                layers: 'NorTrafKommune:Tellepunkt',
                transparent: "true"
            },
            {
                isBaseLayer: false
            }
        );

        settings.layers = [wms];

        settings.apply = function() {
            console.log("Apply wms settings");
            $rootScope.$broadcast("wmsSettingsUpdated");
        };

        return settings;
    });
