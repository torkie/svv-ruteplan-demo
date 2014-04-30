/// <reference path="../ts/typings/angularjs/angular.d.ts"/>
/// <reference path="../ts/typings/angularjs/angular-route.d.ts"/>
var svvRuteplanApp = angular.module("svvRuteplanApp", ['ngRoute', 'svvRuteplanControllers',"ui.bootstrap"])
    .config(['$routeProvider', function ($routeprovider: ng.route.IRouteProvider) {
        $routeprovider.when('/map', { templateUrl: 'Views/MapView.html', controller: 'MapController' });
        $routeprovider.otherwise({ redirectTo: '/map' });
    }]);
