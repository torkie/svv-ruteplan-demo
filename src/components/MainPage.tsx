import * as React from "react";

import {RuteplanMap} from "./RuteplanMap";
import {SearchBar} from "./SearchBar";
import { AddressItem } from "../Model/AddressItem";
import RoutingService, { IRouteResponse } from "../providers/RoutingService";
import { RouteResponseDisplay } from "./RouteResponseDisplay";
import  SettingsPane  from "./SettingsPane";
import SettingsProvider, { ISettingsProviderState } from "../providers/SettingsProvider";
import * as qs from "query-string";
import { SettingsContext } from "../providers/SettingsProvider";

interface MainPageState {
    currentStartLocation : AddressItem;
    currentEndLocation : AddressItem;
    currentRouteResponse: IRouteResponse;
    selectedRouteIdx : number;
}

export class MainPage extends React.Component<any,MainPageState>{
    
    state = {
        currentStartLocation: null as AddressItem,
        currentEndLocation: null as AddressItem,
        currentRouteResponse: null as IRouteResponse,
        selectedRouteIdx : -1 
    };

    static contextType = SettingsContext;

    settings : SettingsProvider;

    constructor(props : any)
    {
        super(props);
        const parsed : any = qs.parse(location.search);
        let from : AddressItem = null;
        let to : AddressItem = null;
        let via : AddressItem[] = null;
        if (parsed.from != null)
        {
            from = JSON.parse(parsed.from);
        }
        if (parsed.to != null)
        {
            to = JSON.parse(parsed.to);
        }

        if (parsed.via != null)
        {
            via = JSON.parse(parsed.via);
        }

        this.state = {currentStartLocation: from, currentEndLocation : to, currentRouteResponse: null, selectedRouteIdx: -1};    
    }

    componentDidMount()
    {
        this.checkPerformRoute();
    }
    
    

    render() {
        return <div>
        <div className={"topbar"}>
            <SearchBar onFromPositionSelected={this.handleFromLocationSet} onToPositionSelected={this.handleToLocationSet} fromLocation={this.state.currentStartLocation} toLocation={this.state.currentEndLocation}/>
            <SettingsPane />
        </div>
        <RuteplanMap fromLocation={this.state.currentStartLocation} toLocation={this.state.currentEndLocation} 
        fromLocationChanged={this.handleFromLocationChangedInMap} 
        toLocationChanged={this.handleToLocationChangedInMap}
        routeResponse={this.state.currentRouteResponse}
        selectedRouteIdx={this.state.selectedRouteIdx}
        routeSelected={this.handleRouteSelected}>
        </RuteplanMap>
        <RouteResponseDisplay routeResponse={this.state.currentRouteResponse} selectedRouteIdx={this.state.selectedRouteIdx} 
        routeSelected={this.handleRouteSelected}/></div>;
    }

    checkPerformRoute()
    {
        let setts  = this.context as ISettingsProviderState;

        if (this.state.currentEndLocation != null && this.state.currentStartLocation != null)
        {
            var routingService = new RoutingService(setts.url, setts.routetype);
            routingService.calculateRoute(this.state.currentStartLocation, this.state.currentEndLocation,null).then((results) => {
                this.setState({currentRouteResponse: results, selectedRouteIdx: 0});
            });
            
        }
    }

    handleRouteSelected = (routeIdx : number)  => {
        this.setState({selectedRouteIdx : routeIdx});
    }


    handleFromLocationChangedInMap = (item: AddressItem) => {
        this.setState({currentStartLocation: item});
        this.checkPerformRoute();
        this.updateSearch("from",item);
    }

    handleToLocationChangedInMap = (item: AddressItem) => {
        this.setState({currentEndLocation: item});
        this.checkPerformRoute();
        this.updateSearch("to",item);
    }

    handleFromLocationSet = (item : AddressItem) => 
    {
        this.setState({currentStartLocation: item});
        this.checkPerformRoute();
        this.updateSearch("from",item);
    }
    handleToLocationSet = (item : AddressItem) =>
    {
        this.setState({currentEndLocation: item});
        this.checkPerformRoute();
        this.updateSearch("to",item);
    }

    updateSearch(param : string, value : any) {
        const parsed : any = qs.parse(location.search);
        parsed[param] = JSON.stringify(value);
        history.pushState({}, document.title,"?"+qs.stringify(parsed));
    }
}