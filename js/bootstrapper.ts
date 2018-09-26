
requirejs.config({
    paths: {
        'angular': '../node_modules/angular/angular',
        'angular-ui-bootstrap': '../node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls',
        'angular-ui-router': '../node_modules/angular-ui-router/release/angular-ui-router.min',
        'angular-cookies' : '../node_modules/angular-cookies/angular-cookies.min',
        'leaflet': '../node_modules/leaflet/dist/leaflet',
        'angular-sanitize': '../node_modules/angular-sanitize/angular-sanitize.min',
        'angular-resource': '../node_modules/angular-resource/angular-resource.min',
        'proj4leaflet': '../node_modules/proj4leaflet/src/proj4leaflet',
        'proj4': '../node_modules/proj4leaflet/lib/proj4-compressed',
        'mouseposition': '../lib/leaflet-control-mousepostion',
        'leaflet-contextmenu': '../node_modules/leaflet-contextmenu/dist/leaflet.contextmenu.min',
        'leaflet-geometryutil': '../node_modules/leaflet-geometryutil/src/leaflet.geometryutil',
        'tokml': '../node_modules/tokml/tokml',
        'leaflet-ajax' : '../node_modules/leaflet-ajax/dist/leaflet.ajax.min'
    },
    shim: {
        'angular': {
          exports: 'angular'
        },
        'angular-ui-bootstrap' : {
            deps: ['angular']
        },
        'angular-cookies' : {
            deps: ['angular']
        },
        'angular-sanitize' : {
            deps: ['angular']
        },
        'angular-resource' : {
            deps: ['angular']
        },
        'mouseposition': {
            deps: ['leaflet']
        },
        'leaflet-contextmenu': {
            deps: ['leaflet']
        },
        'leaflet-geometryutil': {
            deps: ['leaflet']
        },
        'leaflet-ajax': {
            deps: ['leaflet']
        },
        'App' : {
            deps: ['angular','angular-ui-router','angular-ui-bootstrap', "settings", "filters", "domain",'wms', 'angular-sanitize'
            , 'angular-resource', 'routing','searching','LeafLetDirective','mouseposition','leaflet-contextmenu', 'leaflet-geometryutil','tokml', 'leaflet-ajax']
        }
      }
});

requirejs(["App"], function(App) {
    var app = new App.App();
    app.init();
});