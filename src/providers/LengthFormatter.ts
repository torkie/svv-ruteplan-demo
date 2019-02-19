import { MenuItem } from "react-bootstrap-typeahead";

export default class LengthFormatter {
    static formatLength(meters : number) : string
    {
        if (meters < 1000)
        {
            return meters + "m";
        }
        else 
        {
            return Math.round(meters/100)/10+"km";
        }
    }
}