import * as React from "react";
import {Cookies } from 'react-cookie';

const DEAFULT_STATE = {  url : "https://www.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?",
        routetype : "alternative",
        setUrl: (url: string) : void => {} ,
        setRouteType: (routetype: string) : void => {},
        settingsChanged: () => {}
         };

export const SettingsContext : React.Context<ISettingsProviderState> = React.createContext(DEAFULT_STATE);

interface ISettingsProviderProps {

}

export interface ISettingsProviderState {
    url : string;
    routetype: string;
    setUrl : (url : string) => void;
    setRouteType : (routetype : string) => void;
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

    setUrl = (url:string) => {
        this.setState({url:url});
        this.cookies.set("settingsv2", JSON.stringify({url:url, routetype: this.state.routetype}));
    };
    setRouteType = (routeType: string) => {
        this.setState({routetype: routeType});
        this.cookies.set("settingsv2", JSON.stringify({url:this.state.url, routetype: routeType}));
    };

    render() {
        return (<SettingsContext.Provider value={{...this.state}}>{this.props.children}</SettingsContext.Provider>
        );
    }
}