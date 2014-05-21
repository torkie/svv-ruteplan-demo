///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>

angular.module("rpwWms", [])
    .controller("WmsController", ["$scope", "$modal", "wmsSettings", function($scope, $modal, wmsSettings) {

        var dialogController = function($scope, $modalInstance, data) {
            $scope.data = data;
            $scope.newlayer = {};

            $scope.ok = function() {
                $modalInstance.dismiss();
            };

            $scope.addLayer = function() {
                data.addlayer($scope.newlayer.name, $scope.newlayer.url, $scope.newlayer.layer);
                $scope.newlayer.name = "";
                $scope.newlayer.url = "";
                $scope.newlayer.layer = "";
                data.apply();
            };

            $scope.removeLayer = function(layer) {
                data.removeLayer(layer);
                data.apply();
            }

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
        };

    }])
    .factory("wmsSettings", function($rootScope) {
        var settings = settings || {};

        settings.layers = [];

        settings.apply = function() {
            console.log("apply wms settings");
            $rootScope.$broadcast("wmsSettingsUpdated");
        };

        settings.addlayer = function(name, url, layers) {
            var wms = new OpenLayers.Layer.WMS(name, url, {
                    layers: layers,
                    transparent: "true"
                },
                {
                    isBaseLayer: false
                }
            );
            wms["userAddedLayer"] = true;
            settings.layers.push(wms);
        };

        settings.removeLayer = function(layer) {
            var index = settings.layers.indexOf(layer);
            if (index !== -1) {
                console.log("remove " + index);
                settings.layers.splice(index, 1);
            }
        };

        return settings;
    });
