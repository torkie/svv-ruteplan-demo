///<reference path="../../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../domain.ts"/>

class ReportController {
    static $inject = ["$scope","$modalInstance","reportService", "coordinate"];
    constructor(private $scope, private $modalInstance, reportService: SVV.RoutePlanning.IReportService, coordinate: {easting: number; northing: number; proj: string}) {

        $scope.hasErrors = false;
        $scope.requestIsPending = false;
        $scope.requestComplete = false;

        $scope.selectedItem = { category: "" };

        $scope.categories = [
            "Feil i kart", "Feil i rute", "Forslag til forbedringer", "Hull i veien/sykkelvegen", "Knust glass", "Lavt hengende greiner, begrenset utsikt", "Ødelagt gatelykt", "Kommentarer til snørydding/glatt vei", "Annet"
        ];

        $scope.data = new SVV.RoutePlanning.ReportMessage();
        $scope.data.easting = coordinate.easting;
        $scope.data.northing = coordinate.northing;
        $scope.data.coordinateSystem = coordinate.proj;

        $scope.ok = () => {
            $scope.hasErrors = false;
            $scope.requestIsPending = true;
            $scope.data.category = $scope.selectedItem.category;
            var promise = reportService.submit($scope.data);
            promise.then((response) => {
                $scope.requestIsPending = false;

                if (response.data.Status === "OK") {
                    $scope.requestComplete = true;
                }
                else {
                    $scope.hasErrors = true;
                }

            }).catch(() => {
                $scope.hasErrors = true;
                $scope.requestIsPending = false;
            });
        };

        $scope.cancel = () => {
            this.$modalInstance.dismiss();
        };
    }
}

class ReportGuiService {
    static $inject = ["$modal"];
    constructor(private $modal) {
        
    }

    showDialog(easting: number, northing: number, proj: string, size?) {
        this.$modal.open({
            templateUrl: "Views/CreateReport.html",
            controller: ReportController,
            size: size,
            resolve: {
                coordinate: () => {
                    return {
                        easting: easting,
                        northing: northing, 
                        proj: proj
                    };
                }
            }
        });
    }
}

angular.module("rpwReport", ["report"])
    .controller("ReportController", <any>ReportController);

angular.module("rpwReport", [])
    .service("reportGuiService", <any>ReportGuiService);

