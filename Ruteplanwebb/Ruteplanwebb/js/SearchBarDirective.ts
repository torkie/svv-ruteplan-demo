///<reference path="../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../ts/typings/leaflet/leaflet.d.ts"/>
///<reference path="app.ts"/>

class SeachBarDirective {
    restrict: string
    replace: boolean;
    template: string;
    link: any;
    map: L.Map;

    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.template = '<div><div><b>Ruteplan demo</b><br/>' +
        'Fra: <input type="text" ng-model="selectedFrom"  id="searchFrom" typeahead="address.name for address in getLocations($viewValue) | filter:$viewValue" typeahead-leading="loadingAdressFrom" typeahead-on-select="onSelectFrom($item,$model,$label)"/><i ng-show="loadingAdressFrom" class="glyphicon glyphicon-refresh"></i> Til: <input type="text"  ng-model="selectedTo"  typeahead="address.name for address in getLocations($viewValue) | filter:$viewValue" typeahead-leading="loadingAdressTo" typeahead-on-select="onSelectTo($item,$model,$label)" id="searchTo"/><i ng-show="loadingAdressTo" class="glyphicon glyphicon-refresh"></i>' +
        '<input id="searchbutton" type="button" value="Søk" ng-click="doRouteCalculation()"/></div></div>';
        this.link = (scope: any, element: any, attrs: any) => {

        }
    }
}


svvRuteplanApp.directive('searchbar', () => new SeachBarDirective());
