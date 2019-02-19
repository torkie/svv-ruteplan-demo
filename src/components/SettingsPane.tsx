import * as React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
//import SettingsProvider from "../providers/SettingsProvider";
import {SettingsContext, ISettingsProviderState} from "../providers/SettingsProvider";


export interface ISettingsPaneProps {
}
export interface ISettingsPaneState {
}
export default class SettingsPane extends React.Component<ISettingsPaneProps, ISettingsPaneState> {

    static contextType = SettingsContext;
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

    render() {
        let ctx = this.context as ISettingsProviderState;
        return <Tabs className={"settingspane"}>
            <TabList>
            <Tab>Route settings</Tab>
            <Tab>Backend settings</Tab>
            </TabList>
        
            <TabPanel>
            <div className={"settingrow"}>
                <span>Vekt: <input type="text"/>tonn,&nbsp;</span>
                <span>Høyde: <input type="text"/>m,&nbsp;</span>
                <span>Lengde: <input type="text"/>m</span>
            </div>
            <div className={"settingrow"}>
            <span>Tillat kjøring i nullutslippsone: <input type="checkbox"/></span>
            <span>Unngå vinterstengte veier: <input type="checkbox"/></span>
            <span>Unngå "maintenanceWork": <input type="checkbox"/></span>
            <span>Unngå "roadClosed": <input type="checkbox"/></span>
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
            
        </Tabs>;
    }

}