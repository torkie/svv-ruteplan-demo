/// <reference path="../ts/typings/angularjs/angular.d.ts"/>
/// <reference path="../ts/typings/angularjs/angular-route.d.ts"/>

var rpwApp = angular.module("rpwApp", [
    'ngRoute',
    "ng-context-menu",
    "ui.bootstrap",
    'rpwControllers',
    "rpwFilters",
    "rpwDirectives"
]);

rpwApp.config(['$routeProvider',
    ($routeprovider: ng.route.IRouteProvider) => {
        $routeprovider.
            when('/map', {
                templateUrl: 'Views/MapView.html',
                controller: 'MapController'
            }).
            otherwise({
                redirectTo: '/map'
            });
    }]);
