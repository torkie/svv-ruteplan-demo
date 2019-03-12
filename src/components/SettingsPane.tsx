import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
//import SettingsProvider from "../providers/SettingsProvider";
import {SettingsContext, ISettingsProviderState} from "../providers/SettingsProvider";
import TextField from "@material-ui/core/TextField";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

export interface ISettingsPaneProps {
}
export interface ISettingsPaneState {
  expanded : boolean;
}
export default class SettingsPane extends React.Component<ISettingsPaneProps, ISettingsPaneState> {

    static contextType = SettingsContext;
    state = { expanded: false};
      constructor(props : ISettingsPaneProps) {
        super(props);
        
      }  
    
    urlChanged = (e : React.ChangeEvent<HTMLInputElement>) => 
    {
        let ctx = this.context as ISettingsProviderState;
        var val = e.target.value;
        if (ctx.setUrl)
        {
            ctx.setUrl(val);
        }
    };

    typeChanged = (e : React.ChangeEvent<HTMLInputElement>) => 
    {
        let ctx = this.context as ISettingsProviderState;
        var val = e.target.value;
        if (ctx.routetype != null)
        {
            ctx.setRouteType(val);
        }
    };

    toggleExpand = () => 
    {
      this.setState({ expanded: !this.state.expanded});
    }

    render() {
        let ctx = this.context as ISettingsProviderState;
        return <div>
          <div><SettingsIcon style={{zIndex: 400, position: 'absolute',right:315,top:15,color:'#ff9600',background:'rgba(255,255,255,0.9)',borderRadius:5, cursor:'pointer'}} onClick={this.toggleExpand} />
            </div>
          <Tabs style={{visibility: this.state.expanded ? 'visible':'collapse'}}>
            <TabList>
            <Tab>Route settings</Tab>
            <Tab>Backend settings</Tab>
            </TabList>
        
            <TabPanel>
            <div className={"settingrow"}>
                <TextField label="Vekt (tonn)"
                id="inputWeight"
                />
                <TextField label="Høyde (m)"
                id="inputHeight"
                />
                <TextField label="Lengde (m)"
                id="inputLength"
                />
            </div>
            <div className={"settingrow"}>

            <FormControlLabel
          control={
            <Checkbox
              value="checkedF"
              color="primary"
            />
          }
          label="Tillat kjøring i nullutslippsone"
        />
            <FormControlLabel
          control={
            <Checkbox
              value="checkedF"
              color="primary"
            />
          }
          label="Unngå vinterstengte veier"
        />  <FormControlLabel
        control={
          <Checkbox
            value="checkedF"
            color="primary"
          />
        }
        label="Unngå 'maintenanceWork'"/>
        <FormControlLabel
        control={
          <Checkbox
            value="checkedF"
            color="primary"
          />
        }
        label="Unngå 'roadClosed'"/>
            </div>
            </TabPanel>
            <SettingsContext.Consumer>
            {val => {
            return <TabPanel>
               <div className={"settingrow"}>
                <a href="#" onClick={() => {  }}>SVV Prod</a> | <a href="#" onClick={() => {  }}>SVV Test</a> | <a href="#" onClick={() => {  }}>SVV UTV</a> |
                <a href="#" onClick={() => {  }}>Triona UTV</a>
                </div>
                <div className={"settingrow longrow"}>
                    <label>Server-URL:</label><input type="text" value={val.url} onChange={this.urlChanged}/>
                </div>
                <div className={"settingrow longrow"}>
                    <label>Route-Type:</label><input type="text" value={val.routetype} onChange={this.typeChanged}/>
                </div>
            </TabPanel>
            }}</SettingsContext.Consumer>
            
        </Tabs></div>;
    }

}