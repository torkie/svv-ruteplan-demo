///<reference path="MapController.ts"/>

angular.module("rpwControllers", ["routing", "searching"])
    .controller("MapController", ["$scope", "routingService", "geoCodeService", "$location", MapController]);
