import * as React from "react";

import SearchTextBox from "./SearchTextBox";
import { AddressItem } from "../Model/AddressItem";
import { Paper, TextField, Divider, Typography, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DeleteIcon from "@material-ui/icons/Delete";
import { ISettingsProviderState, SettingsContext } from "../providers/SettingsProvider";

interface SearchBarProps{
    fromLocation: AddressItem;
    toLocation : AddressItem;
    intermediateLocations: AddressItem[];
    onFromPositionSelected? : (item : AddressItem) => void;
    onToPositionSelected?: (item: AddressItem) => void;
    onIntermediateLocationChanged? : (index: number, newLocation: AddressItem) => void;
    weight?: number;
    height?: number;
    length?: number;
    allowTravelInZeroEmissionZone:boolean;
    onWeightChanged? : (newValue : number) => void;
    onHeightChanged? : (newValue : number) => void;
    onLengthChanged? : (newValue : number) => void;
    blockedPoints : L.LatLng[];
    onBlockedPointDeleted: (index: number) => void;
    onClearRoute : () => void;
    onTurnRoute : () => void;
    onConfigChanged : () => void;
    allowTravelInZeroEmissionZoneChanged : (allowTravel : boolean) => void;
}

interface SearchBarState {
    expanded: boolean;
}

export class SearchBar  extends React.Component<SearchBarProps, SearchBarState>{

    static contextType = SettingsContext;
    state = { expanded: false};

    toggleExpand = () => 
    {
      this.setState({ expanded: !this.state.expanded});
    }

    urlChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        let ctx = this.context as ISettingsProviderState;
        var val = e.target.value;
        if (ctx.routetype != null)
        {
            ctx.setUrl(val);
        }
    }

    setBackendConfig = (config : string)  => async () => {
        let ctx = this.context as ISettingsProviderState;
        switch (config)
        {
            case "SVVPROD":
            {
                await Promise.all([ctx.setUrl("https://www.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?"), ctx.setRouteType("alternative")]);
                break;
            }
            case "SVVTP":
            {
                await Promise.all([ctx.setUrl("https://www.test.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?"),ctx.setRouteType("alternative")]);
                break;
            }
            case "SVVUTV":
            {
                await Promise.all([ctx.setUrl("https://www.utv.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?"), ctx.setRouteType("alternative")]);
                break;
            }
            case "Triona":
            {
                await Promise.all([ctx.setUrl("http://multirit.triona.se/routingService_v1_0/routingService?"), ctx.setRouteType("")]);
                break;
            }
        }
        this.props.onConfigChanged();
    }

    weightChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onWeightChanged)
        {
            this.props.onWeightChanged(+e.target.value);
        }
    }
    lengthChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onLengthChanged)
        {
            this.props.onLengthChanged(+e.target.value);
        }
    }
    heighChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onHeightChanged)
        {
            this.props.onHeightChanged(+e.target.value);
        }
    }


    routeTypeChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        let ctx = this.context as ISettingsProviderState;
        var val = e.target.value;
        if (ctx.routetype != null)
        {
            ctx.setRouteType(val);
        }
    }

    handleViaLocationChanged = (index: number) => (item : AddressItem) => {
        if (this.props.onIntermediateLocationChanged)
        {
            this.props.onIntermediateLocationChanged(index,item);
        }
    }
    handleViaLocationDeleted = (index: number) => () => {
        if (this.props.onIntermediateLocationChanged)
        {
            this.props.onIntermediateLocationChanged(index,null);
        }
    }
    handleBlockedPointDeleted = (index: number) => () => {
        if (this.props.onBlockedPointDeleted)
        {
            this.props.onBlockedPointDeleted(index);
        }
    }

    handleAllowTravelInZeroEmissionZoneChanged = (e : React.ChangeEvent<HTMLInputElement>) =>
    {
        this.props.allowTravelInZeroEmissionZoneChanged(e.target.checked);
    }

    render() {
        let ctx = this.context as ISettingsProviderState;

        return  <Paper className={"searchbar"} style={{textAlign:'center'}} elevation={5}>
        <SearchTextBox title="Fra" key={this.props.fromLocation != null ? this.props.fromLocation.name : 'from'} value={this.props.fromLocation} onResult={this.props.onFromPositionSelected}/>
        {this.props.intermediateLocations &&
            <div style={{maxHeight: 200, overflowY: this.props.intermediateLocations.length >3 ? 'scroll' : 'hidden'}}>
                {this.props.intermediateLocations.map((loc,i) => {
                    if (loc != null)
                    {
                        return <div key={this.props.intermediateLocations[i].name} style={{width:'100%',lineHeight:'65px',position:'relative',textAlign:'left'}}>
                                <DeleteIcon style={{cursor:'pointer',verticalAlign:'middle', display: 'inline-block'}} onClick={this.handleViaLocationDeleted(i)}/>
                                <div style={{position:'absolute', left:25,right:0,display:'inline-block'}}>
                                <SearchTextBox key={"via_"+i+"_"+this.props.intermediateLocations[i].name} title={"Via " + (i+1)} value={loc} onResult={this.handleViaLocationChanged(i)}/>
                                </div>
                            </div>
                    }
                })}
            </div>
        }
        <SearchTextBox title="Til" key={this.props.toLocation != null ? this.props.toLocation.name : 'to'} value={this.props.toLocation} onResult={this.props.onToPositionSelected}/>
       
        {this.props.blockedPoints &&  this.props.blockedPoints.length > 0 &&
        <div style={{textAlign: 'left', paddingLeft: '10px'}}>
        <span><b>Blocked Points</b></span>
        {this.props.blockedPoints.map((pnt,i) => {
            return <div key={"blockedPnt_" + i} style={{width:'100%',lineHeight:'20px',position:'relative',textAlign:'left'}}>
            <DeleteIcon style={{cursor:'pointer',verticalAlign:'middle', display: 'inline-block',lineHeight:'20px'}} onClick={this.handleBlockedPointDeleted(i)}/>
            <div style={{position:'absolute', left:25,right:0,display:'inline-block', lineHeight:'20px'}}>
                <span>{pnt.lat + "," + pnt.lng}</span>
            </div>
        </div>
        })}
        </div>}
        
        <div style={{width:'100%',lineHeight:'20px',position:'relative',textAlign:'left'}}>
        <Button color="primary" onClick={this.props.onClearRoute}>
        Slett
        </Button>
        <Button color="primary" onClick={this.props.onTurnRoute}>
        Snu ruten
        </Button>
        <Checkbox color="primary">Zoom til beregned rute</Checkbox>
        </div>


         {!this.state.expanded &&
            <ExpandMoreIcon style={{cursor:'pointer'}} onClick={this.toggleExpand}/>
        }
        {this.state.expanded &&
        <div>
            <Divider/>
            <div style={{textAlign:'left', paddingLeft: 10}}>
            <TextField label="Vekt (tonn)"
            id="inputWeight"
            style={{marginRight: 10}}
            value={this.props.weight}
            onChange={this.weightChanged}
            />
            <TextField label="Høyde (m)"
            id="inputHeight"
            style={{marginRight: 10}}
            value={this.props.height}
            onChange={this.heighChanged}
            />
            <TextField label="Lengde (m)"
            id="inputLength"
            value={this.props.length}
            onChange={this.lengthChanged}
            />
             <FormControlLabel
                control={
                    <Checkbox
                    checked={this.props.allowTravelInZeroEmissionZone}
                    onChange={this.handleAllowTravelInZeroEmissionZoneChanged}
                    value="allowTravelInZeroEmissionZone"
                    />
             }
                 label="Tillat kjøring i nullutslippsone"
            />
            
            </div>
            <Divider variant="fullWidth" style={{marginTop: 10}}/>
            <SettingsContext.Consumer>
            {val => {
            return <div className={"settingrow longrow"} style={{textAlign: 'left'}}>
                    <TextField label="Server URL" id="txtServerUrl" style={{marginLeft:10}} value={val.url} onChange={this.urlChanged}/>
                    <TextField label="Route Type" id="txtRouteType" style={{marginLeft:10}} value={val.routetype} onChange={this.routeTypeChanged}/>
                </div>
            }}
            </SettingsContext.Consumer>
            <div style={{width:'100%',lineHeight:'20px',position:'relative',textAlign:'left'}}>
        <Button color="secondary" onClick={this.setBackendConfig("SVVPROD")}>
            SVV Prod
        </Button>
        <Button color="secondary" onClick={this.setBackendConfig("SVVTP")}>
            SVV Testprod
        </Button>
        <Button color="secondary" onClick={this.setBackendConfig("SVVUTV")}>
            SVV UTV
        </Button>
        <Button color="secondary" onClick={this.setBackendConfig("Triona")}>
            Triona UTV
        </Button>
        </div>
        </div>
        }
        {this.state.expanded &&
            <ExpandLessIcon style={{cursor:'pointer'}} onClick={this.toggleExpand}/>
        }
        </Paper>
    }
}