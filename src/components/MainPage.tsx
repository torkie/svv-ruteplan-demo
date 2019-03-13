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
    currentIntermediateLocations: AddressItem[];
    currentRouteResponse: IRouteResponse;
    selectedRouteIdx : number;
    weight? : number;
    length? : number;
    height? : number;
    allowTravelInZeroEmissionZone : boolean;
    blockedPoints : L.LatLng[];
}

class MainPage extends React.Component<any,MainPageState>{
    
    state = {
        currentStartLocation: null as AddressItem,
        currentEndLocation: null as AddressItem,
        currentIntermediateLocations : null as AddressItem[],
        currentRouteResponse: null as IRouteResponse,
        selectedRouteIdx : -1,
        weight : null as number,
        height: null as number,
        length: null as number,
        blockedPoints : null as L.LatLng[], 
        allowTravelInZeroEmissionZone : true
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
        let blockedPoints : L.LatLng[] = null;
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

        if (parsed.blockedPoints)
        {
            blockedPoints = JSON.parse(parsed.blockedPoints);
        }

        let allowZeroEmissionZoneTravel = true;
        if (parsed.allowTravelInZeroEmissionZone)
        {
            allowZeroEmissionZoneTravel = parsed.allowTravelInZeroEmissionZone;
        }

        this.state = {currentStartLocation: from, currentEndLocation : to, currentIntermediateLocations: via, currentRouteResponse: null, selectedRouteIdx: -1,  
            weight: weight, length:length, height: height, blockedPoints: blockedPoints,
            allowTravelInZeroEmissionZone: allowZeroEmissionZoneTravel
        };    
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
                intermediateLocations={this.state.currentIntermediateLocations}                
                onIntermediateLocationChanged={this.handleIntermediateLocationUpdated}
                blockedPoints={this.state.blockedPoints}
                weight={this.state.weight}
                length={this.state.length}
                height={this.state.height}
                onWeightChanged={this.handleWeightChanged}
                onLengthChanged={this.handleLengthChanged}
                onHeightChanged={this.handleHeightChanged}
                onBlockedPointDeleted={this.handleBlockedPointDeleted}
                onClearRoute={this.clearRoute}
                onTurnRoute={this.turnRoute}
                onConfigChanged={this.checkPerformRoute}
                allowTravelInZeroEmissionZone={this.state.allowTravelInZeroEmissionZone}
                allowTravelInZeroEmissionZoneChanged={this.handleAllowTravelInZeroEmissionZoneChanged}
                />
                 <RouteResponseDisplay routeResponse={this.state.currentRouteResponse} selectedRouteIdx={this.state.selectedRouteIdx} 
        routeSelected={this.handleRouteSelected}/>;
            </div>
            <RuteplanMap fromLocation={this.state.currentStartLocation} toLocation={this.state.currentEndLocation} 
            intermediateLocations={this.state.currentIntermediateLocations}
            intermediateLocationChanged={this.handleIntermediateLocationUpdated}
            pointBlocked={this.handleBlockedPoint}
            blockedPoints={this.state.blockedPoints}
            blockedPointDragged={this.handleBlockedPointDragged}
                fromLocationChanged={this.handleFromLocationChangedInMap} 
                toLocationChanged={this.handleToLocationChangedInMap}
                routeResponse={this.state.currentRouteResponse}
                selectedRouteIdx={this.state.selectedRouteIdx}
                routeSelected={this.handleRouteSelected}>
            </RuteplanMap>
       </div>
    }

    checkPerformRoute = () => 
    {
        let setts  = this.context as ISettingsProviderState;

        if (this.state.currentEndLocation != null && this.state.currentStartLocation != null)
        {
            var routingService = new RoutingService(setts.url, setts.routetype);
            routingService.calculateRoute(this.state.currentStartLocation, this.state.currentEndLocation, this.state.currentIntermediateLocations,this.state.blockedPoints,null,this.state.weight,this.state.length,this.state.height,this.state.allowTravelInZeroEmissionZone).then((results) => {
                this.setState({currentRouteResponse: results, selectedRouteIdx: 0});
            });
            
        }
    }

    handleAllowTravelInZeroEmissionZoneChanged = (allowTravel : boolean) => {
        this.setState({allowTravelInZeroEmissionZone: allowTravel}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("allowTravelInZeroEmissionZone", allowTravel);
    }

    clearRoute = () => {
        this.setState({
            currentStartLocation: null,
            currentEndLocation: null,
            currentRouteResponse: null,
            currentIntermediateLocations: null,
            blockedPoints: null
        })
        this.updateSearch("from",null);
        this.updateSearch("to",null);
        this.updateSearch("via",null);
        this.updateSearch("blockedPoints",null);
    }
    turnRoute = () => {
        let pts = null;
        if (this.state.currentIntermediateLocations != null)
        {
            pts = [...this.state.currentIntermediateLocations];
            pts = pts.reverse();
        }
        let newStart = this.state.currentEndLocation;
        let newEnd = this.state.currentStartLocation;
        this.setState({
            currentStartLocation: newStart,
            currentEndLocation : newEnd,
            currentIntermediateLocations: pts
        }, () => {
            this.checkPerformRoute()
        });
        this.updateSearch("from",newStart);
        this.updateSearch("to",newEnd);
        this.updateSearch("via",pts);
    }

    handleBlockedPointDeleted = (i:number) => {
        let pts = [...this.state.blockedPoints];
        pts.splice(i,1);

        this.setState({blockedPoints: pts}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("blockedPoints",pts);
    }

    handleBlockedPointDragged = (i:number, pnt : L.LatLng) => {
        let pts = [...this.state.blockedPoints];
        
        pts[i] = pnt;

        this.setState({blockedPoints: pts}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("blockedPoints",pts);
    }

    handleBlockedPoint = (pnt : L.LatLng) => {
        let pts = [] as L.LatLng[];
        if (this.state.blockedPoints != null)
        {
            pts = [...this.state.blockedPoints];
        }
        pts.push(pnt);

        this.setState({blockedPoints: pts}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("blockedPoints",pts);
    }

    handleIntermediateLocationUpdated = (index : number, value : AddressItem) => {
        let locs = [] as AddressItem[];
        if (this.state.currentIntermediateLocations != null)
        {
            locs = [...this.state.currentIntermediateLocations];
        }

        if (value == null)
        {
            locs.splice(index,1);
        }
        else if (index == -1)
        {
            locs.push(value);
        }
        else
        {
            locs[index] = value;
        }
        this.setState({currentIntermediateLocations: locs}, () => {
            this.checkPerformRoute();
        });
        this.updateSearch("via",locs);
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
        if (value == null)
        {
            delete parsed[param];
        }
        else 
        {
            parsed[param] = JSON.stringify(value);
        }

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