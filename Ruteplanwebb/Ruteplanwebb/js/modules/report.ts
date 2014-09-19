///<reference path="../../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../domain.ts"/>

class ReportController {
    constructor(private $scope, private $modalInstance, reportService: SVV.RoutePlanning.IReportService) {

        $scope.data = new SVV.RoutePlanning.ReportMessage();

        $scope.ok = () => {
            var promise = reportService.submit($scope.data);
            promise.then(() => {
                this.$modalInstance.dismiss();
                console.log("dismissed");
            }).catch((reason) => {
                alert(reason);
            });
        };

        $scope.cancel = () => {
            this.$modalInstance.dismiss();
        };

    }

    //static showDialog($modal, size?) {
    //    $modal.open({
    //        templateUrl: "Views/CreateReport.html",
    //        controller: ReportController,
    //        size: size
    //    });
    //}
}

class ReportGuiService {
    static $inject = ["$modal"];
    constructor(private $modal) {
        
    }

    showDialog(size?) {
        this.$modal.open({
            templateUrl: "Views/CreateReport.html",
            controller: ReportController,
            size: size
        });
    }
}

angular.module("rpwReport", ["report"])
    .controller("ReportController", <any>ReportController);

angular.module("rpwReport", [])
    .service("reportGuiService", <any>ReportGuiService);

