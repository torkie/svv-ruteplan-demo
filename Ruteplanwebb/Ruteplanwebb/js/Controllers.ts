///<reference path="MapController.ts"/>

var svvRuteplanControllers = angular.module('svvRuteplanControllers', ["routing"])
    .controller("MapController", ["$scope","$http", "routingService", MapController]);
