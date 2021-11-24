import * as React from "react";

import { TextField, Icon } from "@material-ui/core";



export interface IParameter {
  id: string;
  key: string;
  value: string;
  firstParameter: boolean;
}

export interface IParameterProps {
  parameter: IParameter;
  removeParameter(id: string): void;
  onParameterChanged(parameter: IParameter): void;
}

export class Parameter extends React.Component<IParameterProps>{


  constructor(props: IParameterProps) {
    super(props);

    this.onKeyChanged = this.onKeyChanged.bind(this);
    this.onValueChanged = this.onValueChanged.bind(this);

  }

  onKeyChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const parameter = { ...this.props.parameter };
    parameter.key = e.target.value;
    this.props.onParameterChanged(parameter);
  }

  onValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const parameter = { ...this.props.parameter };
    parameter.value = e.target.value;
    this.props.onParameterChanged(parameter);

  }

  

  render() {
    const visibleButton = {
      display: "inline-block"
    } as React.CSSProperties;

    const HiddenButton = {
      display: "none"
    } as React.CSSProperties;


    return (
      <div style={{ textAlign: 'left', paddingLeft: 10 }}>
        <TextField label={"Parameter type"}
          id="inputUserClass"
          style={{ marginRight: 10 }}
          onChange={this.onKeyChanged}
          value = {this.props.parameter.key}

        />
        <TextField label="Parameter verdi"
          id="inputHeight"
          style={{ marginRight: 10 }}
          onChange={this.onValueChanged}
          value = {this.props.parameter.value}
        />
        <Icon className="parameterRemoveButton" onClick={() => this.props.removeParameter(this.props.parameter.id)}   style={this.props.parameter.firstParameter ? HiddenButton : visibleButton}>remove_circle</Icon>

      

      </div>


    );
  }
}