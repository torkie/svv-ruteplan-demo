///<reference path="../../ts/typings/angularjs/angular.d.ts"/>
///<reference path="../domain.ts"/>

angular.module("report", [])
    .factory("reportService", ($http, $q) => new FiksVegdataService($http, $q));

class FiksVegdataService implements SVV.RoutePlanning.IReportService {
    private _serviceUrl: string = "http://fiksvegdata-utv.opentns.org/Api/CreateReport";

    constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
    }

    submit = (message: SVV.RoutePlanning.ReportMessage) => {
        /*var defer = this.$q.defer<SVV.RoutePlanning.IReportServiceResponse>();

        var promises = [
            this.handleSubmit(message)
        ];

        this.$q.all(promises).then(results => {
            var ret = results[0];
            defer.resolve(ret);
        });

        return defer.promise;*/
        return this.handleSubmit(message);
    }


    handleSubmit = (message: SVV.RoutePlanning.ReportMessage) => this.$http.post(this._serviceUrl, {
        params: {
            title: message.title,
            description: message.description,
            reportername: message.reporterName,
            email: message.email,
            easting: message.easting,
            northing: message.northing,
            coordinatesystem: message.coordinateSystem,
            category: message.category
        }
    }).then(json => {

        return <SVV.RoutePlanning.IReportServiceResponse>json;
        });
}