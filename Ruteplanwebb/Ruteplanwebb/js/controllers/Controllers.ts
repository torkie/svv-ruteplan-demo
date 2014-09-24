///<reference path="MapController.ts"/>

angular.module("rpwControllers", ["routing", "searching", "report", "rpwWms", "rpwReport", "rpwAbout"])
    .controller("MapController", ["$scope", "routingService", "geoCodeService", "$location", "wmsSettings", "$state", "reportGuiService", "AboutGuiService", MapController]);
