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
                            url: $cookies.url,
                            username: $cookies.username,
                            password: $cookies.password
                        }
                    }
                }
            });

            modalInstance.result.then(function(data) {
                console.log("ok");
                $cookies.url = data.url;
                $cookies.username = data.username;
                $cookies.password = data.password;
                console.log($cookies);
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
            settings["url"] = "http://default.com";
        } else {
            settings["url"] = $cookies.url;
        }
        if ($cookies["username"] === undefined) {
            settings["username"] = "user";
        } else {
            settings["username"] = $cookies.username;
        }
        if ($cookies["password"] === undefined) {
            settings["password"] = "pass";
        } else {
            settings["password"] = $cookies.password;
        }

        settings["save"] = function() {
            console.log("save settings");
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
