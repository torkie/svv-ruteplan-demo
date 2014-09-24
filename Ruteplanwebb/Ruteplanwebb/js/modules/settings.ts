///<reference path="../../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwSettings", ["ngCookies"])
    .controller("SettingsController", [
        "$scope", "$modal", "settings", ($scope, $modal, settings) => {

            var dialogController = ($scope, $modalInstance, data) => {
                $scope.data = data;

                $scope.ok = () => {
                    $modalInstance.close($scope.data);
                };

                $scope.cancel = () => {
                    $modalInstance.dismiss("cancel");
                };

            };

            $scope.open = (size) => {
                var modalInstance = $modal.open({
                    templateUrl: "settings.html",
                    controller: dialogController,
                    size: size,
                    resolve: {
                        data: () => {
                            return settings;
                        }
                    }
                });

                modalInstance.result.then((data) => {
                    data.save();
                });
            };

        }
    ])
    .factory("settings", ($cookieStore) => {
        var settings = $cookieStore.get("settings") || {};

        if (settings.url === undefined) {
            settings.url = SVV.RoutePlanning.AppConfig.routeServiceUrl;
            settings.useproxy = SVV.RoutePlanning.AppConfig.useproxy;
        }

        settings.save = () => {
            $cookieStore.put("settings", settings);
        };

        return settings;
    });
