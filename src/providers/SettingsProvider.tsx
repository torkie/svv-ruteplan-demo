import * as React from "react";
import {Cookies } from 'react-cookie';

const DEAFULT_STATE = {  url : "https://www.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?",
        routetype : "alternative",
        setUrl:  async (url: string) : Promise<void> => {} ,
        setRouteType: async (routetype: string) : Promise<void> => {},
        settingsChanged: () => {}
         };

export const SettingsContext : React.Context<ISettingsProviderState> = React.createContext(DEAFULT_STATE);

interface ISettingsProviderProps {

}

export interface ISettingsProviderState {
    url : string;
    routetype: string;
    setUrl : (url : string) => Promise<void>;
    setRouteType : (routetype : string) => Promise<void>;
    settingsChanged: () => void;
}
export default class SettingsProvider extends React.Component<ISettingsProviderProps, ISettingsProviderState> {

    state = DEAFULT_STATE;
    private cookies : Cookies;
    constructor(props : any) {
        super(props);
        this.cookies = new Cookies();

        var setts = this.cookies.get("settingsv2");
        if (setts != undefined && setts != null)
        {
            var obj = setts as any;
            
            this.state.url = obj.url;
            this.state.routetype = obj.routetype;            
        }

        this.state.setUrl = this.setUrl;
        this.state.setRouteType =this.setRouteType;
    }

    setUrl =  async (url:string) : Promise<void> => {
        let promise = await new Promise<void>((resolve, reject) => {
            this.setState({url:url}, () => {
                resolve();
            });
            this.cookies.set("settingsv2", JSON.stringify({url:url, routetype: this.state.routetype}));
        }).catch(err => {throw err});

        return promise;
        
        
    };
    setRouteType = async (routeType: string) : Promise<void> => {
        let promise = await new Promise<void>((resolve,reject) => {
            this.setState({routetype: routeType}, () => {
                resolve();
            });
        this.cookies.set("settingsv2", JSON.stringify({url:this.state.url, routetype: routeType}));
        }).catch(err => { throw err;});
        return promise;
    };

    render() {
        return (<SettingsContext.Provider value={{...this.state}}>{this.props.children}</SettingsContext.Provider>
        );
    }
}