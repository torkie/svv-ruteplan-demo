///<reference path="MapController.ts"/>

angular.module("rpwControllers", ["routing","searching"])
    .controller("MapController", ["$scope","$http", "routingService","geoCodeService","$location", MapController]);
