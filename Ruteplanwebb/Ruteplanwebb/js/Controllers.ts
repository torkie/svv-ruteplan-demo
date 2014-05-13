///<reference path="MapController.ts"/>

angular.module("rpwControllers", ["routing"])
    .controller("MapController", ["$scope","$http", "routingService","$location", MapController]);
