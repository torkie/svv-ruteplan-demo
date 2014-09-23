///<reference path="../../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../domain.ts"/>

angular.module("report", [])
    .factory("reportService", ($http, $q) => new FiksVegdataService($http, $q));

class FiksVegdataService implements SVV.RoutePlanning.IReportService {
    private _serviceUrl: string = "http://fiksvegdata-test.opentns.org/PublicApi/CreateReport";

    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
    }

    submit = (message: SVV.RoutePlanning.ReportMessage) => {
        return this.$http.post(this._serviceUrl, message).then(json => {
            return <SVV.RoutePlanning.IReportServiceResponse>json;
        });
    }
}