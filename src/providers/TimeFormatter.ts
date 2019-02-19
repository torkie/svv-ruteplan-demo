export default class TimeFormatter{
    static formatTimeFromMintes(minutes : number) : string {
        if (minutes < 61)
        {
            let min = Math.floor(minutes);
            let sek = Math.round((minutes-min)*60);
            return min + "min " + this.zeroPadLeft(sek+"",2) + "sek";
        }
        else 
        {
            let hours = Math.floor(minutes/60);
            let min = Math.round((minutes-hours*60));
            return hours + "h " + this.zeroPadLeft(min+"",2) + "min";
        }
    }

    static zeroPadLeft(val:string, len:number) : string
    {
        return val.length < 2 ? "0"+val : val;
    }
}