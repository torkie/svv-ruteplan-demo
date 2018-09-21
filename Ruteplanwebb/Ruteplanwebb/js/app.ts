import ng = require("angular");
import settings = require("./settings");
import {MapController} from './MapController';

var rpwApp : ng.IModule;

export class App {

    constructor()
    {
    }
    /**
     * init
     */
    public init() {    
        rpwApp = ng.module("rpwApp", [
            'ui.router',
            "ui.bootstrap",
            'ngSanitize',
            "ngCookies",
            "rpwFilters",
            "rpwDirectives",
            "rpwSettings",
            "rpwWms",
            "routing",
            "searching"
        ]);

        rpwApp.config(['$stateProvider', '$urlRouterProvider',
            ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider : ng.ui.IUrlRouterProvider) => {
                $urlRouterProvider.otherwise("/");
                $stateProvider.
                    state('mappage', <ng.ui.IState>{
                        url: '/?from&to',
                        templateUrl: 'Views/MapView.html',
                        controller: 'MapController',
                        reloadOnSearch: false
            });
            }]);

        rpwApp.filter('to_trusted', [
                '$sce', function($sce) {
                    return function(text : string) {
                        return $sce.trustAsHtml(text);
                    };
                }
            ]);

            rpwApp.controller("MapController", MapController);

           ng.bootstrap(document,['rpwApp']);
        }
}