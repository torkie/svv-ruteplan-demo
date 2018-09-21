import * as angular from 'angular';
import * as L from 'leaflet';

interface IWmsScope  extends angular.IScope {
        data : any;
        newlayer : any;
        ok: () => void;
        addLayer: () => void;
        removeLayer: (layer: L.Layer) => void;
        getCapabilities: () => void;
}

angular.module("rpwWms", ['ui.bootstrap'])
    .controller("WmsController", ["$http", "$scope", "$uibModal","$uibModalStack", "wmsSettings", function($http, $scope, $uibModal,$uibModalStack, wmsSettings) {

        var dialogController = function($scope : IWmsScope, $uibModal, data : any) {
            $scope.data = data;
            $scope.newlayer = {};

            $scope.ok = function() {
                var top = $uibModalStack.getTop();
                if (top) {
                    $uibModalStack.close(top.key);
                }
            };

            $scope.addLayer = function() {
                if (!$scope.newlayer.url || !$scope.newlayer.layer) {
                    return;
                }
                if (!$scope.newlayer.name) {
                    $scope.newlayer.name = $scope.newlayer.layer;
                }
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
                if (!url) {
                    return;
                }
                $http.get("wmsCapabilities", {
                        params: { url: $scope.newlayer.url }
                    }
                ).success(function(data) {
                    var layers = [];    
                    /*var caps = wms.read(data);
                        
                        angular.forEach(caps.capability.layers, function(layer) {
                            layers.push(layer.name);
                        });*/
                        $scope.newlayer.availableLayers = layers;
                        if (layers.length > 0) {
                            $scope.newlayer.layer = layers[0];
                        }
                    }
                );
            }
        };

        $scope.open = (size) => {
            var modalInstance = $uibModal.open({
                templateUrl: "wms.html",
                controller: dialogController,
                backdropClass: "show",
                windowClass: "show",
                size: size, backdrop: false, 
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
            var wms = L.tileLayer.wms('url',{layers: layers, transparent: true});
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
