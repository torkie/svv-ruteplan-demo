///<reference path="../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwSettings", ["ngCookies"])
    .controller("SettingsController", ["$scope", "$modal", "$cookies", function($scope, $modal, $cookies) {

        console.log($cookies);

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

    }]);

var ModalInstanceCtrl = function($scope, $modalInstance, data) {
    $scope.data = data;

    $scope.ok = function() {
        $modalInstance.close($scope.data);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

};
