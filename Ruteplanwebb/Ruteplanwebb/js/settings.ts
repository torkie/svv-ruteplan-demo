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

            $scope.setSetting = function(setting: String) {
                if (setting === "vegvesenProd") {
                    data.url = "https://www.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
                    data.useproxy = false;
                    data.routetype = "alternative";
                    data.username = "";
                    data.password = "";
                }
                else if (setting === "vegvesenTest") {
                    data.url = "https://www.test.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
                    data.useproxy = false;
                    data.routetype = "alternative";
                    data.username = "";
                    data.password = "";
                }
                if (setting === "vegvesenUtv") {
                    data.url = "https://www.utv.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
                    data.useproxy = false;
                    data.routetype = "alternative";
                    data.username = "";
                    data.password = "";
                }
                if (setting === "Triona") {
                    data.url = "http://multirit.triona.se/routingService_v1_0/routingService?";
                    data.useproxy = false;
                    data.routetype = "";
                    data.username = "";
                    data.password = "";
                }
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
            });
        };

    }])
    .factory("settings", function($cookieStore) {
        var settings = $cookieStore.get("settingsv2") || {};

        if (settings.url === undefined) {
            settings.url = "https://www.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
            settings.useproxy = false;
            settings.routetype = "alternative";

        }

        settings.save = function() {
            $cookieStore.put("settingsv2", settings);
        };

        return settings;
    });
