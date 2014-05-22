///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/openlayers/openlayers.d.ts"/>

angular.module("rpwWms", [])
    .controller("WmsController", ["$http", "$scope", "$modal", "wmsSettings", function($http, $scope, $modal, wmsSettings) {

        var dialogController = function($scope, $modalInstance, data) {
            $scope.data = data;
            $scope.newlayer = {};

            $scope.ok = function() {
                $modalInstance.dismiss();
            };

            $scope.addLayer = function() {
                data.addlayer($scope.newlayer.name, $scope.newlayer.url, $scope.newlayer.layer);
                $scope.newlayer.name = null;
                $scope.newlayer.url = null;
                $scope.newlayer.layer = null;
                $scope.newlayer.availableLayers = null;
                data.apply();
            };

            $scope.removeLayer = function(layer) {
                data.removeLayer(layer);
                data.apply();
            };

            $scope.getCapabilities = function() {
                var url = $scope.newlayer.url;
                if (url === undefined || url === null || url === "") {
                    return;
                }
                console.log("getting layers");
                var wms = new OpenLayers.Format.WMSCapabilities();
                $http.get("wmsCapabilities", {
                        params: { url: $scope.newlayer.url }
                    }
                ).success(function(data) {
                        var caps = wms.read(data);
                        var layers = [];
                        angular.forEach(caps.capability.layers, function(layer) {
                            layers.push(layer.name);
                        });
                        $scope.newlayer.availableLayers = layers;
                        if (layers.length > 0) {
                            $scope.newlayer.layer = layers[0];
                        }
                    }
                );
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
