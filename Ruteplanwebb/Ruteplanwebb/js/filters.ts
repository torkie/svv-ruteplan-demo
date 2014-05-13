///<reference path="../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwFilters", [])
    .filter("time", function() {
        return function(input) {
            var hours = Math.floor(input / 60);
            var mins = Math.round(input - (hours * 60));

            var output = "";

            if (hours > 0) {
                output += hours + " time";
                if (hours > 1) {
                    output += "r";
                }
                if (mins > 0) output += " ";
            }
            if (mins > 0) {
                output += mins + " minutt";
                if (mins > 1) {
                    output += "er";
                }
            }

            return output;
        }
    })
    .filter("distance", function() {
        return function(input) {
            return Math.round(input / 1000) + " kilometer";
        }
    })
    .filter("direction", function() {
        return function(input : string) {
            var i = input.indexOf("}");
            if (i > 0) {
                return input.substr(i + 1);
            } else {
                return input;
            }
        }
    })
    .filter("signpost", function () {
        return function (input: string) {
            var i = input.indexOf("}");
            if (i > 0) {
                return input.replace(/\{([ERFKPS])(\d+)\}.*/i, "<div class='road-sign-$1'>$1v $2</div>");
            } else {
                return input;
            }
        }
    })
    .filter("round", function() {
        return function(input) {
            return Math.round(input);
        }
    });
