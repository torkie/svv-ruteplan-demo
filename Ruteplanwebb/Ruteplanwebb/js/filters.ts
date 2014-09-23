///<reference path="../ts/typings/angularjs/angular.d.ts"/>

angular.module("rpwFilters", [])
    .filter("time", () => {
        return (input) => {
            var output = "";

            var secs = Math.round(input * 60);
            if (secs < 60) {
                output = secs + " sekund";
                if (secs > 1) output += "er";
                return output;
            }

            var hours = Math.floor(input / 60);
            var mins = Math.round(input - (hours * 60));

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
    .filter("distance", () => {
        return (input) => {
            if (input < 1000) {
                return Math.round(input) + " meter";
            } else {
                return Math.round(input / 1000) + " kilometer";
            }
        }
    })
    .filter("distanceAbbr", () => {
        return (input) => {
            if (input < 1000) {
                return Math.round(input) + " m";
            } else {
                return Math.round(input / 100) / 10 + " km";
            }
        }
    })
    .filter("bikedistance", () => {
        return (input) => {
            if (input < 1000) {
                return Math.round(input) + " meter";
            } else {
                return Math.round(input / 100) / 10 + " kilometer";
            }
        }
    })
    .filter("kcal", () => {
        return (input) => {
            return Math.round(input) + " kcal";
        }
    })
    .filter("co2", () => {
        return (input)  => {
            if (input < 1000) {
                return Math.round(input) + " g";
            } else {
                return Math.round(input / 100) / 10 + " kg";
            }
        }
    })
    .filter("cost", () => {
        return (input) => {
            return Math.round(input * 10) / 10 + " kr";
        }
    })
    .filter("direction", () => {
        return (input : string) => {
            var i = input.indexOf("}");
            if (i > 0) {
                return input.substr(i + 2);
            } else {
                return input;
            }
        }
    })
    .filter("signpost", () => {
        return (input: string) => {
            var i = input.indexOf("}");
            if (i > 0) {
                return input.replace(/\{([ERFKPS])(\d+)\}.*/i, "<div class='road-sign-$1'>$1v $2</div>");
            } else {
                return input;
            }
        }
    })
    .filter("round", () => {
        return (input) => {
            return Math.round(input);
        }
    });
