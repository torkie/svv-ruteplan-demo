///<reference path="MapController.ts"/>

var svvRuteplanControllers = angular.module('svvRuteplanControllers', [])
    .controller("MapController", ["$scope","$http", MapController]);