///<reference path="../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwSettings", ["ngCookies"])
    .controller("SettingsController", ["$scope", "$modal", "settings", function($scope, $modal, settings) {

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
                templateUrl: "settings.html",
                controller: dialogController,
                size: size,
                resolve: {
                    data: function() {
                        return settings;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                data.save();
            }, function() {
                console.log("cancelled");
            });
        };

    }])
    .factory("settings", function($cookieStore) {
        var settings = $cookieStore.get("settings") || {};

        if (settings.url === undefined) {
            settings.url = "http://multirit.triona.se/routingService_v1_0/routingService";
        }

        settings.save = function() {
            $cookieStore.put("settings", settings);
        };

        return settings;
    });
