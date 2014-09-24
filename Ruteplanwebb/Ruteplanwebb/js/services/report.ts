///<reference path="../../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../domain.ts"/>
///<reference path="../AppSettings.ts"/>

angular.module("report", [])
    .factory("reportService", ($http, $q) => new FiksVegdataService($http, $q));

class FiksVegdataService implements SVV.RoutePlanning.IReportService {

    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
    }

    submit = (message: SVV.RoutePlanning.ReportMessage) => {
        var url = SVV.RoutePlanning.AppConfig.reportServiceUrl;
        return this.$http.post(url, message).then(json => {
            return <SVV.RoutePlanning.IReportServiceResponse>json;
        });
    }
}