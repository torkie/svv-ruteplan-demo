import * as angular from 'angular';
import 'angular-cookies';

angular.module("rpwSettings", ["ngCookies","ui.bootstrap"])
    .controller("SettingsController", ["$scope", "$uibModal","$uibModalStack", "settings", function($scope, $modal,$uibModalStack, settings,) {

        var dialogController = function($scope, $uibModal, data) {
            $scope.data = data;

            $scope.ok = function() {
                $scope.data.save();
                var top = $uibModalStack.getTop();
                if (top) {
                    $uibModalStack.close(top.key);
                }
            };

            $scope.cancel = function() {
                var top = $uibModalStack.getTop();
                if (top) {
                    $uibModalStack.close(top.key);
                }
                //$uibModal.dismiss("cancel");
            };

            $scope.setSetting = function(setting: String) {
                if (setting === "vegvesenProd") {
                    data.url = "https://www.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
                    data.useproxy = false;
                    data.routetype = "alternative";
                    data.username = "";
                    data.password = "";
                }
                else if (setting === "vegvesenTest") {
                    data.url = "https://www.test.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
                    data.useproxy = false;
                    data.routetype = "alternative";
                    data.username = "";
                    data.password = "";
                }
                if (setting === "vegvesenUtv") {
                    data.url = "https://www.utv.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
                    data.useproxy = false;
                    data.routetype = "alternative";
                    data.username = "";
                    data.password = "";
                }
                if (setting === "Triona") {
                    data.url = "http://multirit.triona.se/routingService_v1_0/routingService?";
                    data.useproxy = false;
                    data.routetype = "";
                    data.username = "";
                    data.password = "";
                }
            };

        };

        $scope.open = function(size) {
            var modalInstance = $modal.open({
                templateUrl: "settings.html",
                controller: dialogController,
                backdropClass: "show",
                windowClass: "show",
                size: size, backdrop: false, 
                resolve: {
                    data: function() {
                        return settings;
                    }
                }
            });
        };

    }])
    .factory("settings", function($cookies : angular.cookies.ICookiesService) {        
        var settings =  new Settings($cookies.get("settingsv2"), $cookies);
        return settings;
    });

    class Settings {
        constructor(str : string,$cookies : angular.cookies.ICookiesService)
        {
            if (str != undefined && str != null && str != "" && str.length > 0)
            {
                var obj = JSON.parse(str);
                this.url = obj.url;
                this.useproxy = obj.useproxy;
                this.routetype = obj.routetype;
            }
            else{
                this.url = "https://www.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
                this.useproxy = false;
                this.routetype = "alternative";
            }

            this.save = () => {
                $cookies.put("settingsv2", JSON.stringify(this));
            }
        }
        url : string;
        useproxy : boolean;
        routetype : string;
        save: () => any;
    }