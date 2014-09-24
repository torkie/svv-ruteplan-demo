module SVV.RoutePlanning {
    
    export class AppConfig {
        public static routeServiceUrl: string = "http://multirit.triona.se/RoutingService_v1_0/RoutingService";
        public static reportServiceUrl: string = "http://fiksvegdata-test.opentns.org/PublicApi/CreateReport";
        public static sKWSServiceUrl: string = "https://ws.geonorge.no/SKWS3Index/ssr/sok";
        public static norgesKartServiceUrl: string = "http://beta.norgeskart.no/ws/adr.py?";
        public static useproxy: boolean = false;
        public static showChartOnFirsRoute: boolean = true;
    }
}