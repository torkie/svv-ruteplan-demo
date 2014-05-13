module.exports = function (config) {
    config.set({

        basePath: "../",

        frameworks: ["jasmine"],

        files: [
            "lib/angular/angular.js",
            "lib/angular/angular-route.js",
            "lib/angular/angular-mocks.js",
            "js/helpers/CompressedGeometryHelper.js",
            "js/filters.js",
            "tests/js/**/*.js"
        ],

        reporters: ["progress"],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        singleRun: false,

        browsers: ["PhantomJS"]
    });
};
