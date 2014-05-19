///<reference path="../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwSettings", ["ngCookies"])
    .controller("SettingsController", ["$scope", "$modal", "$cookies", "settings", function($scope, $modal, $cookies, settings) {

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
    .factory("settings", function($cookies) {
        var settings = {};

        console.log("Cookies from settings service:");
        console.log($cookies);

        if ($cookies.url === undefined) {
            settings["url"] = "http://multirit.triona.se/routingService_v1_0/routingService";
        } else {
            settings["url"] = $cookies.url;
        }
        if ($cookies["username"] !== undefined) {
            settings["username"] = $cookies.username;
        }
        if ($cookies["password"] !== undefined) {
            settings["password"] = $cookies.password;
        }

        settings["save"] = function() {
            console.log("save settings");
            $cookies.url = settings["url"];
            $cookies.username = settings["username"];
            $cookies.password = settings["password"];
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
