"use strict";

describe("filter", function() {

    beforeEach(module("rpwFilters"));

    describe("time", function() {

        it("should format time",
            inject(function(timeFilter) {
                expect(timeFilter(60)).toBe("1 time");
                expect(timeFilter(61)).toBe("1 time 1 minutt");
                expect(timeFilter(59)).toBe("59 minutter");
                expect(timeFilter(1)).toBe("1 minutt");
                expect(timeFilter(122)).toBe("2 timer 2 minutter");
            }));
    });

    describe("distance", function() {

        it("should format distance",
            inject(function(distanceFilter) {
                expect(distanceFilter(1000)).toBe("1 kilometer");
                expect(distanceFilter(2000)).toBe("2 kilometer");
                expect(distanceFilter(2500)).toBe("3 kilometer");
            }));
    });

    describe("direction", function() {

        it("should remove road tag",
            inject(function(directionFilter) {
                expect(directionFilter("{K13707} Start on Kirkegata")).toBe("Start on Kirkegata");
            }));
    });

});
