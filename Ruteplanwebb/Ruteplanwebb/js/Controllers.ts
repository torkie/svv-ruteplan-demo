///<reference path="MapController.ts"/>

angular.module("rpwControllers", ["routing", "searching", "rpwWms"])
    .controller("MapController", ["$scope", "routingService", "geoCodeService", "$location", "wmsSettings", MapController]);
