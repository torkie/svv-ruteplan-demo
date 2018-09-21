module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-serve");
    grunt.loadNpmTasks('grunt-bundles');
    grunt.loadNpmTasks('grunt-package-modules');

    var vendorDir = 'lib';
    var nodeDir = 'node_modules';

    grunt.initConfig({
        packageModules: {
            dist: {
              src: 'package.json',
              dest: 'lib'
            },
          },
        ts: {
            dev: {
                src: ["js/*.ts"],
                options : {
                    sourceMap: true,
                    declaration: true,
                    module: 'amd',
                    target: 'es5'
                }
            }
        },
        serve: {
            options: {
                port: 9000
            }
        },
        bundles: {
            options: {
                aliases : [
                    {
                        cwd  : "node_modules",
                        src  : ["lib/*.js"],
                        dest : "lib"
                    }
                ]
              // Task-specific options go here.
            },
            your_target: {
              // Target-specific file lists and/or options go here.
            },
          },
    });

    grunt.registerTask("default", ["ts:dev","bundles","serve"]);

};
