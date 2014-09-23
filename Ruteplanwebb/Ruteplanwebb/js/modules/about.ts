///<reference path="../../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../domain.ts"/>

class AboutController {
    static $inject = ["$scope", "$modalInstance"];
    constructor(private $scope, private $modalInstance) {

        $scope.numPages = 2;

        $scope.pages = [{ id: 0, title: 'Om Cykelreseplaneraren' }, { id: 1, title: 'Beregningsprinsipp for kostnader og utslipp' }];

        // $scope.pages = { 0: 'Om Cykelreseplaneraren', 1: 'Beregningsprinsipp for kostnader og utslipp' };

        $scope.currentPageId = 0;
        $scope.currentPageTitle = $scope.pages[0].title;

        $scope.changePage = (idx: number) => {
            if (idx < 0 || idx >= $scope.numPages) {
                return;
            }

            $scope.currentPageId = idx;
            $scope.currentPageTitle = $scope.pages[idx].title;
        };

        $scope.nextPage = () => {
            if ($scope.currentPageId == $scope.numPages - 1) {
                $scope.changePage(0);
            }
            else {
                $scope.changePage($scope.currentPageId + 1);    
            }
        }
        $scope.prevPage = () => {
            if ($scope.currentPageId == 0) {
                $scope.changePage($scope.numPages - 1);
            }
            else {
                $scope.changePage($scope.currentPageId - 1);
            }
        }

        $scope.ok = () => {
            $modalInstance.dismiss();
        };
    }
}

class AboutGuiService {
    static $inject = ["$modal"];
    constructor(private $modal) {

    }

    showDialog(size?) {
        this.$modal.open({
            templateUrl: "Views/AboutView.html",
            controller: AboutController,
            size: size,
        });
    }
}

angular.module("rpwAbout", [])
    .controller("AboutController", <any>AboutController);

angular.module("rpwAbout", [])
    .service("AboutGuiService", <any>AboutGuiService);

