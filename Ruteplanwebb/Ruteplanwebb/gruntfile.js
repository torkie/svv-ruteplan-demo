module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-karma');

    grunt.initConfig({
        ts: {
            dev: {
                src: ["js/*.ts", "tests/js/**/*.ts"]
            }
        },
        karma: {
            unit: {
                configFile: "tests/karma.conf.js"
            }
        }
    });

    grunt.registerTask("default", ["ts:dev"]);
    grunt.registerTask("test", ["ts:dev", "karma:unit"]);

};
