///<reference path="../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwSettings", ["ngCookies"])
    .controller("SettingsController", ["$scope", "$modal", "settings", "$cookieStore", function($scope, $modal, settings, $cookieStore) {

        $scope.open = function(size) {
            var modalInstance = $modal.open({
                templateUrl: 'settings.html',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    data: function() {
                        return {
                            url: settings.url,
                            username: settings.username,
                            password: settings.password
                        }
                    }
                }
            });

            modalInstance.result.then(function(data) {
                console.log("ok");
                settings.url = data.url;
                settings.username = data.username;
                settings.password = data.password;
                settings.save();
            }, function() {
                console.log("cancelled");
            });
        };

    }])
    .factory("settings", function($cookies, $cookieStore) {
        var settings = $cookieStore.get("settings") || {};

        if (settings.url === undefined) {
            settings.url = "http://multirit.triona.se/routingService_v1_0/routingService";
        }

        settings.save = function() {
            $cookieStore.put("settings", settings);
        };

        return settings;
    });

var ModalInstanceCtrl = function($scope, $modalInstance, data) {
    $scope.data = data;

    $scope.ok = function() {
        $modalInstance.close($scope.data);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

};
