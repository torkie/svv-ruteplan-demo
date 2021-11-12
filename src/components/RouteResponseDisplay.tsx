import * as React from "react";
import { IRouteResponse } from "../providers/RoutingService";
import TimeFormatter from "../providers/TimeFormatter";
import LengthFormatter from "../providers/LengthFormatter";
import { RoadFeature } from "../model/RouteResponse";
import { CameraComponent } from "./CameraComponent";
import {  ViewDirectionFeature } from "../Model/RouteResponse";
import { Paper } from "@material-ui/core";



export interface RouteResponseDisplayProps {
    routeResponse: IRouteResponse;
    selectedRouteIdx: number;
    routeSelected: (routeIdx: number) => void;
}
export interface RouteResponseDisplayState {

}

export class RouteResponseDisplay extends React.Component<RouteResponseDisplayProps, RouteResponseDisplayState>{

    render() {

        return <div style={{ position: 'relative', marginTop: 15 }}><div className="routeResponseDisplay" style={{ height: 50 }}>{
            this.props.routeResponse != null && this.props.routeResponse.directions != null && this.props.routeResponse.directions.map((direction, i) => {
                return <Paper elevation={this.props.selectedRouteIdx == i ? 0 : 3} key={i} className={this.props.selectedRouteIdx == i ? "selected" : ""} onClick={() => {
                    if (this.props.routeSelected != null) {
                        this.props.routeSelected(i);
                    }
                }}>{direction.routeName}
                    <br />{LengthFormatter.formatLength(direction.summary.totalLength)} / {TimeFormatter.formatTimeFromMintes(direction.summary.totalDriveTime)}</Paper>
            })
        }
        </div>
            <Paper className={"selectedRouteDisplay"} elevation={5}>
                {this.renderSelectedTurnstructionHeader()}
                {this.renderTurnInstructions()}
            </Paper></div>;
    }
    renderSelectedTurnstructionHeader() {
        if (this.props.selectedRouteIdx >= 0 && this.props.routeResponse != null && this.props.routeResponse.directions != null) {
            let direction = this.props.routeResponse.directions[this.props.selectedRouteIdx];
            let directionAny = direction as any;
            return <div className={"routestats"}>
                <img src="/images/car-icon.png" height="20" /> {direction.TotalTollSmall}kr
                <img src="/images/Truck-icon.png" height="20" /> {direction.TotalTollLarge}kr
                {(direction as any).summary && (direction as any).summary.statistics && (direction as any).summary.statistics.DistanceInZeroEmissionZone > 0 &&
                    <div className={"nullutslippszone"}>Lengde i nullutslippsone:
                        {LengthFormatter.formatLength((direction as any).summary.statistics.DistanceInZeroEmissionZone)}</div>}

                {directionAny.TotalTollSmall < directionAny.TotalTollSmallWithoutDiscount &&
                    <div className={"bomstasjonnorebate"}>Bomstasjonskostnad uten timesregel:
                        <br /><img src="/images/car-icon.png" height="20" /> {directionAny.TotalTollSmallWithoutDiscount}kr
                        <img src="/images/Truck-icon.png" height="20" /> {directionAny.TotalTollLargeWithoutDiscount}kr</div>
                }
            </div>;
        }
    }

    renderTurnInstructions() {
        if (this.props.selectedRouteIdx >= 0 && this.props.routeResponse != null && this.props.routeResponse.directions != null) {
            return this.props.routeResponse.directions[this.props.selectedRouteIdx].features.map((direction, i) => {
                return <div key={"direction_" + i} className="directions">
                    {
                        (direction as ViewDirectionFeature).roadCat &&
                        <div className={"signpost " + "signpost-" + (direction as ViewDirectionFeature).roadCat}>{(direction as ViewDirectionFeature).roadCat}{(direction as ViewDirectionFeature).roadNumber}</div>
                    }
                    {direction.attributes.text} {this.renderMeterOnInstruction(direction as ViewDirectionFeature)}<br />
                    {
                        (direction as ViewDirectionFeature).roadCamera && (direction as ViewDirectionFeature).roadCamera.map((roadCamera: RoadFeature) => (<div>
                            <CameraComponent roadCamera={roadCamera} /> </div>))
                    }
                </div>
            });
        }
        return null;
    }

    renderMeterOnInstruction(direction: ViewDirectionFeature): JSX.Element {
        if ((direction.attributes as any).length > 0) {
            return <span>og kjør <b>{LengthFormatter.formatLength((direction.attributes as any).length * 1000)}</b></span>;
        }
        return null;
    }
}
