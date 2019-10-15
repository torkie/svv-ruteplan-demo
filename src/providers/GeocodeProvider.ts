import * as L from "leaflet";
import "proj4leaflet";
import axios from "axios";
import {AddressItem} from "../Model/AddressItem";

export interface IGeocodeService {
    geocodeLocation(query: string) : Promise<AddressItem[]>;
}

export class GeocodeService implements IGeocodeService {

    private projectionUTM33 : L.Projection;
    private projectionUTM32 : L.Projection;

    constructor(){
        this.projectionUTM33 =  new L.Proj.CRS("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs").projection;
        this.projectionUTM32 =  new L.Proj.CRS("EPSG:32632", "+proj=utm +zone=32 +ellps=WGS84 +units=m +no_defs").projection;
    }

    async geocodeLocation(query: string){
        
        let skwsRes = await this.getLocationsSKWS(query);
        let nkRes = await this.getLocationsNorgesKart(query);

        var ret : AddressItem[] = [];
        skwsRes.forEach(element => {
            ret.push(element);
        });

        nkRes.forEach(element=> {
            ret.push(element);
        })

        return ret;
    }

    getLocationsNorgesKart = (val : string) => axios.get("https://ws.geonorge.no/norgeskart/v1/matrikkel/veg/" + encodeURIComponent(val)).then(res => {
        var addresses = new Array<AddressItem>();

        if (Array.isArray(res.data)) {
            res.data.forEach((item: string) => {
                addresses.push(this.CreateAddressItemFromNorgesKartItem(item));
            });
        } else if (res.data != null) {
            addresses.push(this.CreateAddressItemFromNorgesKartItem(res.data));
        }

        return addresses;

    });

    CreateAddressItemFromNorgesKartItem(item: any) : AddressItem {
        var coordWgs = this.projectionUTM32.unproject(new L.Point(parseFloat(item.LONGITUDE), parseFloat(item.LATITUDE)));
        var parts : string[] = [];

        item.TITTEL.forEach((part: string) => {parts.push(part)});
        parts.push(item.FYLKESNAVN);
        var name = parts.join(", ");
        
        return { name: name, location: coordWgs};
    }


    //Get from SKWS
    getLocationsSKWS = (val : string) => axios.get("https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=" + encodeURIComponent(val) + "*&maxAnt=20&antPerSide=20&eksakteForst=true").then(jsonRes => {
        var res = <{stedsnavn: any}>jsonRes.data;
        var addresses = new Array<AddressItem>();

        if (Array.isArray(res.stedsnavn)) {
            res.stedsnavn.forEach((item:any) => {
                addresses.push(this.CreateAddressItemFromWKItem(item));
            });
        } else if (res.stedsnavn != null) {
            res.stedsnavn.forEach((item:any) => {
                addresses.push(this.CreateAddressItemFromWKItem(res.stedsnavn));
            });
        }

        return addresses;
    });

    CreateAddressItemFromWKItem(item: any) : AddressItem {
        var location = this.projectionUTM33.unproject(new L.Point(parseFloat(item.aust),parseFloat(item.nord)));
        var name = item.stedsnavn + ", " + item.kommunenavn + ", " + item.fylkesnavn + " (" + item.navnetype + ")";

        return {name : name, location: location};
    }
}