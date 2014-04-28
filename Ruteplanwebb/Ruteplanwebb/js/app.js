/// <reference path="../Scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Scripts/typings/angularjs/angular-route.d.ts"/>
var svvRuteplanApp = angular.module("svvRuteplanApp", ['ngRoute', 'svvRuteplanControllers', "ui.bootstrap"]).config([
    '$routeProvider', function ($routeprovider) {
        $routeprovider.when('/map', { templateUrl: 'Views/MapView.html', controller: 'MapController' });
        $routeprovider.otherwise({ redirectTo: '/map' });
    }]);
//# sourceMappingURL=app.js.map
