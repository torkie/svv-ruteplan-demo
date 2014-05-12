///<reference path="../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwFilters", [])
    .filter("time", function() {
        return function(input) {
            var hours = Math.floor(input / 60);
            var mins = Math.round(input - (hours * 60));
            var fmin = function(mins) {
                if (mins > 1) {
                    return mins + " minutter";
                } else if (mins == 1) {
                    return mins + " minutt";
                } else {
                    return "";
                }
            };
            if (hours > 0) {
                return hours + " timer " + mins + " minutter";
            } else {
                return mins + " minutter";
            }
        }
    })
    .filter("distance", function() {
        return function(input) {
            return Math.round(input / 1000) + " kilometer";
        }
    });
