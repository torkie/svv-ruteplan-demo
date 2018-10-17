import * as angular from 'angular';
import {IMapControllerScope} from './scopes';
import {IGeoCodeService,IRoutingService, ViewDirectionFeature, Value, RoadFeature, AddressItem,ViewDirection} from './domain';

import * as L from 'leaflet';
import * as Helper from "./helpers/CompressedGeometryHelper";
import { Settings } from './settings';

var tokml = require('tokml');
var geomutil = require('leaflet-geometryutil');

/* The MapController, holds functionality for the map implementation (autocomplete, searching, routing,...)*/
export class MapController implements angular.IController {

    private projectionUTM33 : L.Projection;

    static $inject = ["$scope", "routingService", "geoCodeService", "$location", "wmsSettings", "$uibModal","$sce", "$uibModalStack", "settings"];
    constructor(private $scope: IMapControllerScope, routingService: IRoutingService,  
        geoCodeService: IGeoCodeService, $location : ng.ILocationService, wmsSettings: { layers : L.Layer[]}, $uibModal,$sce,$uibModalStack, settings : Settings) {
            
        this.projectionUTM33 =  new L.Proj.CRS("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs").projection;
        var routeStyle = {
            //graphicZIndex: 2,
            opacity: 0.9,
            color: "#008CFF",
            weight: 5
        };

        var alternativeRouteStyle = {
            //graphicZIndex: 1,
            opacity: 0.9,
            color: "#858585",
            weight: 5
        };

        $scope.getLocations = (val) => {
            return geoCodeService.getLocations(val);
        };

        $scope.avoidRoadsClosedForWinter = true;
        $scope.avoidRoadClosed = false;
        $scope.avoidMaintenanceWork = false;
        $scope.route_type = 'car';
        $scope.updateRouteType = () => {
            settings.routetype = $scope.route_type;
            settings.save();
        };

        $scope.openFerryPopup = (name: string, rawurl: string) => {
            var url = $sce.trustAsResourceUrl(rawurl);
            var modalInstance = $uibModal.open({
                templateUrl: "ferryUrl.html",
                controller: ($scope) =>  {
                    $scope.name = name.replace("_",":");  
                    $scope.url = url;
                    $scope.close = () => {
                        var top = $uibModalStack.getTop();
                        if (top != null)
                        {
                            $uibModalStack.close(top.key);
                        }
                    }
                },
                backdropClass: "show",
                windowClass: "show",
                backdrop: true, 
                size: "custom-lg",
                
                resolve: {
                    data: function() {
                        return null;
                    }
                }
            }).result.then(function(){}, function(res){});
        };

        $scope.doRouteCalculation = () => {
            $scope.routeLayer.clearLayers();
            $scope.directions = null;

            var locations = [];

            var avoid = [];
            if ($scope.avoidRoadsClosedForWinter)
            {
                avoid.push("closedPermanentlyForTheWinter");
            }
            if ($scope.avoidMaintenanceWork)
            {
                avoid.push("maintenanceWork");
            }
            if ($scope.avoidRoadClosed)
            {
                avoid.push("roadClosed");
            }
            
            

            var idx = 0;
            locations[idx++] = (<any>$scope.map.options.crs).projection.project($scope.fromAddress.location);

            if ($scope.intermediateAddresses != null) {
                angular.forEach($scope.intermediateAddresses, (med) => {
                    locations[idx++] = (<any>$scope.map.options.crs).projection.project(med.location);
                });
            }
            locations[idx] = (<any>$scope.map.options.crs).projection.project($scope.toAddress.location);

            idx = 0;
            var blockedPoints = [];
            if ($scope.blockedPoints != null && $scope.blockedPoints.length > 0)
            {
                angular.forEach($scope.blockedPoints, (blockedpoint) => {
                    blockedPoints[idx++] = (<any>$scope.map.options.crs).projection.project(blockedpoint);
                });
            }


            routingService.calculateRoute(locations,
            (bounds, features: {geometry: L.Polyline} [], directions: ViewDirection[]) => {
                $scope.directions = directions;

                // zoom map if current bounds does not contain route
                if (bounds != null)
                {
                    $scope.map.fitBounds(bounds);
                }

                if (features != null)
                {
                    // add features to map
                    var first = true;
                    angular.forEach(features, (feature) => {
                        feature.geometry.setStyle(first ? routeStyle : alternativeRouteStyle).addTo($scope.routeLayer);
                        first = false;
                    });
                }
                
                if (directions != null && directions.length > 0) {
                    $scope.selectRoute(directions[0].routeId);
                }

                }, blockedPoints, $scope.blockedAreas, $scope.weight, $scope.height, $scope.length, $scope.allowTravelInZeroEmissionZone,avoid);
        };

        $scope.reverseRoute = () => {
            var from = $scope.fromAddress;
            $scope.fromAddress = $scope.toAddress;
            $scope.toAddress = from;

            if ($scope.intermediateAddresses != undefined) {
                $scope.intermediateAddresses.reverse();
            }


            $scope.updateMarkers();
        };

        $scope.removeBlocks = () => {
            $scope.blockedPoints = [];
            $scope.blockedAreas = [];

            $scope.updateMarkers();
        };

        $scope.hasBlocks = () => {
            var points = $scope.blockedPoints != undefined && $scope.blockedPoints.length > 0;
            var areas = $scope.blockedAreas != undefined && $scope.blockedAreas.length > 0;
            return points || areas;
        };

        $scope.updateMarkers = () => {            
            if ($scope.markerLayer != null)
            {
                $scope.markerLayer.clearLayers();
            }

            if ($scope.barrierLayer != null)
            {
                $scope.barrierLayer.clearLayers();
            }

            if ($scope.fromAddress != null) {
                var featureFrom = new L.Marker($scope.fromAddress.location, {
                    icon: new L.Icon({
                        iconUrl:  '/images/frommarker.png',
                        iconSize: [35,46],
                        iconAnchor: [17,46]                        
                    }),
                    draggable: true
                });

                featureFrom.on("dragend", (e : L.DragEndEvent) => {
                    $scope.fromAddress = new AddressItem("Punkt i kartet", 
                    featureFrom.getLatLng());
                    $scope.updateMarkers();
                });

                featureFrom.addTo($scope.markerLayer);
                $location.search('from', JSON.stringify($scope.fromAddress));
            }
            if ($scope.toAddress != null) {
                var featureTo = new L.Marker($scope.toAddress.location, {
                    icon: new L.Icon({
                        iconUrl:  '/images/tomarker.png',
                        iconSize: [35,46],
                        iconAnchor: [17,46]                        
                    }),
                    draggable: true
                });

                featureTo.on("dragend", (e : L.DragEndEvent) => {
                    $scope.toAddress = new AddressItem("Punkt i kartet", 
                    featureTo.getLatLng());
                    $scope.updateMarkers();
                });

                featureTo.addTo($scope.markerLayer);
                $location.search('to', JSON.stringify($scope.toAddress));
            }

            if ($scope.intermediateAddresses != undefined) {

                angular.forEach($scope.intermediateAddresses, (addr,index) => {
                    var featureVia = new L.Marker(addr.location, {
                        icon: new L.Icon({
                            iconUrl:  '/images/viamarker.png',
                            iconSize: [35,46],
                            iconAnchor: [17,46]                        
                        }),
                        draggable: true
                    });

                    var viaIndex = index;
    
                    featureVia.on("dragend", (e : L.DragEndEvent) => {
                        $scope.intermediateAddresses[viaIndex] = new AddressItem("Punkt i kartet", 
                        featureVia.getLatLng());
                        $scope.updateMarkers();
                    });
    
                    featureVia.addTo($scope.markerLayer);
                });

                $location.search('intermediate', JSON.stringify($scope.intermediateAddresses));
            }

            if ($scope.blockedPoints != undefined) {
                angular.forEach($scope.blockedPoints, (point,index) => {
                    var featureBlockedPoint = new L.Marker(point, {
                        icon: new L.Icon({
                            iconUrl:  '/images/block-icon.png',
                            iconSize: [25,25],
                            iconAnchor: [12,12]                        
                        }),
                        draggable: true
                    });
    
                    featureBlockedPoint.on("dragend", (e : L.DragEndEvent) => {
                        $scope.blockedPoints[index] = featureBlockedPoint.getLatLng();
                        $scope.updateMarkers();
                    });
    
                    featureBlockedPoint.addTo($scope.barrierLayer);
                });
                $location.search('blockedPoints', JSON.stringify($scope.blockedPoints));
            }

            if ($scope.height != undefined) {
                if (typeof $scope.height == "string")
                    $scope.height = +(<any>$scope.height).replace(",", ".");
                if ($scope.height > 4.5)
                    $scope.height = 4.5;
                $location.search('height', JSON.stringify($scope.height));
            }
            if ($scope.weight != undefined) {
                if (typeof $scope.weight == "string")
                    $scope.weight = +(<any>$scope.weight).replace(",", ".");
                if ($scope.weight > 50)
                    $scope.weight = 50;
                $location.search('weight', JSON.stringify($scope.weight));
            }
            if ($scope.length != undefined) {
                if (typeof $scope.length == "string")
                    $scope.length = +(<any>$scope.length).replace(",", ".");
                $location.search('length', JSON.stringify($scope.length));
            }

            $location.search('allowTravelInZeroEmissionZone', JSON.stringify($scope.allowTravelInZeroEmissionZone));

            //If both from and to are set, do route calculation automatically
            if ($scope.fromAddress != null && $scope.toAddress != null) {
                $scope.doRouteCalculation();
            }

        };

        $scope.contextMenuAddIntermediate = (e : { latlng : L.LatLng}) => {
            if ($scope.intermediateAddresses === undefined) {
                $scope.intermediateAddresses = [];
            }

            var idx = $scope.intermediateAddresses.length;
            $scope.intermediateAddresses[idx] = new AddressItem("Via: Punkt i kartet", e.latlng);
            $scope.updateMarkers();
        };

        $scope.removeIntermediate = (item:AddressItem) => {
            var idx = $scope.intermediateAddresses.indexOf(item);

            $scope.intermediateAddresses.splice(idx, 1);

            $scope.updateMarkers();
        };

        $scope.contextMenuSetFrom = (e : { latlng : L.LatLng}) => {
            $scope.fromAddress = new AddressItem("Punkt i kartet", e.latlng);
            $scope.updateMarkers();
        };

        $scope.contextMenuSetTo = (e : { latlng : L.LatLng}) => {
            $scope.toAddress = new AddressItem("Punkt i kartet", e.latlng);
            $scope.updateMarkers();
        };

        $scope.contextMenuBlockPoint = (e : { latlng : L.LatLng}) => {
            if ($scope.blockedPoints === undefined) {
                $scope.blockedPoints = [];
            }
            var snapped : {latlng : L.LatLng, distance: number} =  (<any>L).GeometryUtil.closestLayerSnap($scope.map,$scope.routeLayer.getLayers(), e.latlng,20,true);
            $scope.blockedPoints.push(snapped != null ? snapped.latlng : e.latlng);
            $scope.updateMarkers();
        };

        $scope.toggleMapControl = (key : string) => {
            angular.forEach($scope.controls, (wrapper) => {
                if (wrapper.name == key) {
                    wrapper.control.activate();
                } else {
                    wrapper.control.deactivate();
                }
            });
        };

        $scope.selectedRouteId = null;

        $scope.selectRoute = (routeId: string) => {
            $scope.selectedRouteId = routeId;

            // Draw routes
                $scope.routeLayer.eachLayer((feature : L.Path) => {
                if ((<any>feature).options.routeId === routeId) {
                    feature.setStyle(routeStyle);
                    feature.bringToFront();
                } else {
                    feature.setStyle(alternativeRouteStyle);
                }
            });

            // Create road features for selected route
            $scope.routeFeatureLayer.clearLayers();

            var features = $scope.directions[routeId].features;
            angular.forEach(features, (feature:ViewDirectionFeature) => {
                if (feature.attributes != undefined) {

                    if (feature.attributes.roadFeatures != undefined && feature.attributes.roadFeatures.length > 0) {
                        angular.forEach(feature.attributes.roadFeatures, (feat : RoadFeature) => {
                            var type = feat.attributeType;
                            var subType = type.substr(type.indexOf(':')+1);
                            var imageName = null;
                            var geometry = null;
                            var hasLocation = feat.location != undefined && feat.location.length > 0;
                            var values = feat.values;
                            var clickFunc = null;
                            var html = "<span class='mo_featureType'>" + type + "</span><br/>";
                            var isRelevant = (type.match(/^nvdb/i) && ["Bomstasjon", "Rasteplass","Ferge","ferge"].indexOf(subType)+1) || type.match(/^vegloggen/i);

                            if (type.match(/^nvdb/i) || type.match(/^vegloggen/i)) {

                                var name = $scope.getValue(values, "Navn");
                                if (name == null) {
                                    name = "Ukjent navn";
                                }
                                html += "<h3>"+name+"</h3>";
                                if (type.match(/^nvdb/i)) {
                                    imageName = subType;

                                    if (subType.match(/ferge/i))
                                    {
                                        imageName = "ferry-icon";
                                        var geom = Helper.CompressedGeometryHelper.extractPointsFromCompressedGeometry(feature.compressedGeometry);
                                        var latLngs : L.LatLng[] = [];
                                        geom.forEach(point => {
                                            latLngs.push(this.projectionUTM33.unproject(new L.Point(point.x, point.y)));
                                        });

                                        var res = geomutil.interpolateOnLine($scope.map,latLngs,0.5);
                                        geometry = res.latLng;
                                        hasLocation = true;
                                        var url =values.filter(x=>x.key == "Url")[0].value;
                                        
                                        clickFunc = (e : MouseEvent) => {
                                           $scope.openFerryPopup(name,url);
                                        };

                                    }
                                    else if (subType.match(/Rasteplass/i) || subType.match(/Bomstasjon/i)) {


                                    }
                                } else if (type.match(/^vegloggen/i)) {

                                    imageName = "trafikkmelding";
                                    html = "<b>Trafikkmelding</b>";
                                }

                                angular.forEach(values, (val: Value) => {
                                    html += "<b>" + val.key + "</b>: " + val.value + "<br/>";
                                });

                                if (hasLocation && geometry == null) {
                                    var loc = feat.location[0];
                                    geometry = (<any>this.$scope.map.options.crs).projection.unproject(new L.Point(loc.easting, loc.northing));
                                } else {
                                    //console.log(feat);
                                }
                            }

                            if (isRelevant && hasLocation) {

                                var f = new L.Marker(geometry, {
                                    riseOnHover: true,
                                    icon: new L.Icon({
                                        iconUrl:   "/images/"+imageName+".png",
                                        iconSize: [25,25],
                                        iconAnchor: [12,12]                        
                                    })
                                });

                                f.on("mouseover", (e : MouseEvent) => {
                                    this.$scope.mouseoverinfo = html;
                                    this.$scope.$apply();
                                });
                                f.on("mouseout", (e : MouseEvent) => {
                                    this.$scope.mouseoverinfo =null;
                                    this.$scope.$apply();
                                });

                                if (clickFunc != null)
                                {
                                    f.on("click", clickFunc);
                                }

                                f.addTo($scope.routeFeatureLayer);
                            }
                        });
                    }
                }
            });
        };

        $scope.getValue = (values : Value[], key : string) : string => {
            var ret = null;
            angular.forEach(values, (val : Value) => {
                if (val.key === key) {
                    ret = val.value;
                }
            });

            return ret;
        };

        $scope.showRoute = (id : string) => id === $scope.selectedRouteId;

        $scope.zoomToDirection = (routeId: number) => {
            $scope.map.fitBounds($scope.directions[routeId].Bounds);
        };

        if ($location.search().from != null) {
            $scope.fromAddress = JSON.parse($location.search().from);
            if ((<any>$scope.fromAddress.location).lon !== undefined) {
                //Old version, convert..
                $scope.fromAddress.location = this.projectionUTM33.unproject(new L.Point((<any>$scope.fromAddress.location).lon, $scope.fromAddress.location.lat));
            }
        }
        if ($location.search().to != null) {
            $scope.toAddress = JSON.parse($location.search().to);
            if ((<any>$scope.toAddress.location).lon !== undefined) {
                //Old version, convert..
                $scope.toAddress.location =  this.projectionUTM33.unproject(new L.Point((<any>$scope.toAddress.location).lon, $scope.toAddress.location.lat));
            }
        }

        if ($location.search().intermediate != null) {
            $scope.intermediateAddresses = JSON.parse($location.search().intermediate);
            if ($scope.intermediateAddresses != null)
            {
                for (var i = 0; i < $scope.intermediateAddresses.length; i++)
                {
                    if ((<any>$scope.intermediateAddresses[i].location).lon !== undefined) {
                        //Old version, convert..
                        $scope.intermediateAddresses[i].location =  this.projectionUTM33.unproject(new L.Point((<any>$scope.intermediateAddresses[i].location).lon, $scope.intermediateAddresses[i].location.lat));
                    }
                }
            }
        }

        if ($location.search().blockedPoints != null) {
            $scope.blockedPoints = JSON.parse($location.search().blockedPoints);
            if ($scope.blockedPoints != null)
            {
                for (var i = 0; i < $scope.blockedPoints.length; i++)
                {
                    if ((<any>$scope.blockedPoints[i]).lon !== undefined) {
                        //Old version, convert..
                        $scope.blockedPoints[i] =  this.projectionUTM33.unproject(new L.Point((<any>$scope.blockedPoints[i]).lon, $scope.blockedPoints[i].lat));
                    }
                }
            }
        }

        if ($location.search().blockedAreas != null) {
            $scope.blockedAreas = JSON.parse($location.search().blockedAreas);
        }

        if ($location.search().weight != null) {
            $scope.weight = JSON.parse($location.search().weight);
        }

        if ($location.search().height != null) {
            $scope.height = JSON.parse($location.search().height);
        }

        if ($location.search().length != null) {
            $scope.length = JSON.parse($location.search().length);
        }

        if ($location.search().allowTravelInZeroEmissionZone != null) {
            $scope.allowTravelInZeroEmissionZone = JSON.parse($location.search().allowTravelInZeroEmissionZone);
        } else {
            $scope.allowTravelInZeroEmissionZone = true;
        }

        $scope.$watch('markerLayer', () => {
            $scope.updateMarkers();
        });

        $scope.downloadRouteAsKML = (routeId : number,$event) => {
            var elem = $event.target;
            var feat = $scope.routeLayer.getLayers()[routeId];
            var kml = tokml((<L.Polyline>feat).toGeoJSON(),{
                documentName: 'SVV Ruteplan Export',
                documentDescription: 'Exported route from SVV Ruteplan Demo Client', 
                simplestyle: true
             });
            var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(kml);
            elem.setAttribute("target", "_blank");
            elem.setAttribute("href", data);
        };

        $scope.$on("wmsSettingsUpdated", function() {
            console.log("wms settings updated");
            // find all user added layers
            var map = $scope.map;
            var userAddedLayers = [];
            map.eachLayer((layer) => {
                if (layer["userAddedLayer"] != undefined)
                {
                    userAddedLayers.push(layer);
                }
            });
            // remove layers that have been deleted
            angular.forEach(userAddedLayers, function(layer) {
                if (wmsSettings.layers.indexOf(layer) === -1) {
                    map.removeLayer(layer);
                }
            });
            // add new layers
            angular.forEach(wmsSettings.layers, function(layer) {
                if (userAddedLayers.indexOf(layer) === -1) {
                    map.addLayer(layer);
                }
            });

            // reorder route layers on top of wms layers
            $scope.routeLayer.setZIndex(100);
            $scope.routeFeatureLayer.setZIndex(200);
            $scope.markerLayer.setZIndex(300);
            $scope.barrierLayer.setZIndex(400);

            for (var layer in wmsSettings.layers)
            {
                (<L.Layer><any>layer).addTo($scope.map);
            };
        });
    }

}
