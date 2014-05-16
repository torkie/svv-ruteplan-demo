///<reference path="../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwSettings", [])
    .controller("SettingsController", ["$scope", "$modal", function($scope, $modal){
        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'settings.html',
                controller: ModalInstanceCtrl,
                size: size
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
                console.log("ok");
            }, function () {
                console.log("cancelled");
            });
        };

    }]);

var ModalInstanceCtrl = function ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

};
