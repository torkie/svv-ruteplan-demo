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
            var url = settings["url"];
            if (url === undefined || url === "" || url === null) {
                delete $cookies["url"];
            } else {
                $cookies.url = settings["url"];
            }
            
            var username = settings["username"];
            if (username === undefined || username === "" || username === null) {
                delete $cookies["username"];
            } else {
                $cookies.username = settings["username"];
            }

            var password = settings["password"];
            if (password === undefined || password === "" || password === null) {
                delete $cookies["password"];
            } else {
                $cookies.password = settings["password"];
            }
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
