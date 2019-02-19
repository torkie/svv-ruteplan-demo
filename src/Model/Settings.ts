import * as React from "react";
import { withCookies, Cookies } from 'react-cookie';

export const SettingsContext = React.createContext({});


export default class Settings {
    constructor(str : string,cookies : Cookies)
    {
        if (str != undefined && str != null)
        {
            var obj = str as any;
            this.url = obj.url;
            this.useproxy = obj.useproxy;
            this.routetype = obj.routetype;
        }
        else{
            this.url = "https://www.vegvesen.no/ws/no/vegvesen/ruteplan/routingService_v1_0/routingService?";
            this.useproxy = false;
            this.routetype = "alternative";
        }

        this.save = () => {
            cookies.set("settingsv2", JSON.stringify(this));
        }
    }
    url : string;
    useproxy : boolean;
    routetype : string;
    save: () => any;
}