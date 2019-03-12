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
import { AppBar, Toolbar, IconButton, Typography, Button, withStyles } from "@material-ui/core";

interface MainPageState {
    currentStartLocation : AddressItem;
    currentEndLocation : AddressItem;
    currentRouteResponse: IRouteResponse;
    selectedRouteIdx : number;
    weight? : number;
    length? : number;
    height? : number;
}

class MainPage extends React.Component<any,MainPageState>{
    
    state = {
        currentStartLocation: null as AddressItem,
        currentEndLocation: null as AddressItem,
        currentRouteResponse: null as IRouteResponse,
        selectedRouteIdx : -1,
        weight : null as number,
        height: null as number,
        length: null as number
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
        let weight : number = null;
        let height: number = null;
        let length : number = null;
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

        if (parsed.weight != null)
        {
            weight = +parsed.weight;
        }
        if (parsed.height != null)
        {
            height = +parsed.height;
        }
        if (parsed.length != null)
        {
            length = +parsed.length;
        }

        this.state = {currentStartLocation: from, currentEndLocation : to, currentRouteResponse: null, selectedRouteIdx: -1,  weight: weight, length:length, height: height};    
    }

    componentDidMount()
    {
        this.checkPerformRoute();
    }
    
    

    render() {
        const { classes } = this.props;
        return <div>
            <Toolbar className={"header"}>
            <a href="/default.htm">Til forsiden</a>
            <Typography variant="h6" color="inherit" className={classes.grow}>
                SVV testklient før Ruteplantjenesten
            </Typography>
            </Toolbar>
            <div style={{position:'absolute', right: 10, top:15, zIndex:400}}>
                <SearchBar onFromPositionSelected={this.handleFromLocationSet} onToPositionSelected={this.handleToLocationSet} 
                fromLocation={this.state.currentStartLocation} toLocation={this.state.currentEndLocation}
                weight={this.state.weight}
                length={this.state.length}
                height={this.state.height}
                onWeightChanged={this.handleWeightChanged}
                onLengthChanged={this.handleLengthChanged}
                onHeightChanged={this.handleHeightChanged} />
                 <RouteResponseDisplay routeResponse={this.state.currentRouteResponse} selectedRouteIdx={this.state.selectedRouteIdx} 
        routeSelected={this.handleRouteSelected}/>;
            </div>
            <RuteplanMap fromLocation={this.state.currentStartLocation} toLocation={this.state.currentEndLocation} 
                fromLocationChanged={this.handleFromLocationChangedInMap} 
                toLocationChanged={this.handleToLocationChangedInMap}
                routeResponse={this.state.currentRouteResponse}
                selectedRouteIdx={this.state.selectedRouteIdx}
                routeSelected={this.handleRouteSelected}>
            </RuteplanMap>
       </div>
    }

    checkPerformRoute()
    {
        let setts  = this.context as ISettingsProviderState;

        if (this.state.currentEndLocation != null && this.state.currentStartLocation != null)
        {
            var routingService = new RoutingService(setts.url, setts.routetype);
            routingService.calculateRoute(this.state.currentStartLocation, this.state.currentEndLocation,null,null,this.state.weight,this.state.length,this.state.height).then((results) => {
                this.setState({currentRouteResponse: results, selectedRouteIdx: 0});
            });
            
        }
    }

    handleWeightChanged = (val : number) => {
        this.setState({weight : val}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("weight",val);
    }

    handleLengthChanged = (val : number) => {
        this.setState({length : val}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("length",val);
    }

    handleHeightChanged = (val : number) => {
        this.setState({height : val}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("height",val);
    }

    handleRouteSelected = (routeIdx : number)  => {
        this.setState({selectedRouteIdx : routeIdx});
    }


    handleFromLocationChangedInMap = (item: AddressItem) => {
        this.setState({currentStartLocation: item}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("from",item);
    }

    handleToLocationChangedInMap = (item: AddressItem) => {
        this.setState({currentEndLocation: item}, () => {
        this.checkPerformRoute();
        });
        this.updateSearch("to",item);
    }

    handleFromLocationSet = (item : AddressItem) => 
    {
        this.setState({currentStartLocation: item}, () => {
        this.checkPerformRoute();
        });
        this.updateSearch("from",item);
    }
    handleToLocationSet = (item : AddressItem) =>
    {
        this.setState({currentEndLocation: item}, () => {
        this.checkPerformRoute();
        });
        this.updateSearch("to",item);
    }

    updateSearch(param : string, value : any) {
        const parsed : any = qs.parse(location.search);
        parsed[param] = JSON.stringify(value);
        history.pushState({}, document.title,"?"+qs.stringify(parsed));
    }
}

const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };

export default withStyles(styles)(MainPage as any);