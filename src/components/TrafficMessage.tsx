import { RoadFeature, Location, Value } from "../Model/RouteResponse";
import * as React from "react";
import Modal from 'react-modal';
import { Icon } from "@material-ui/core";


export interface ITrafficMessageProps {
  trafficMessage: RoadFeature;
}

interface ITrafficMessageState {
  modalIsOpen: boolean;

}
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: 'max-content',
    width: '100%',
    overflow: 'none'
  },
  overlay: {
    zIndex: 10000
  }
};


export class TrafficMessage extends React.Component<ITrafficMessageProps, ITrafficMessageState>{

  constructor(props: ITrafficMessageProps) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalIsOpen: false
    };

  }


  showTrafficMessageDetails() {

    this.setState({ modalIsOpen: true });
  }


  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {

    return (

      <div >
        <a onClick={() => this.showTrafficMessageDetails()} > {this.props.trafficMessage.attributeType}</a>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
            <h2> Trafikkmelding  {this.props.trafficMessage.attributeType}</h2>

            {
              this.props.trafficMessage.location.map((location: Location) => (<div  >
                Geometri N : {location.northing},E : {location.easting},SRS : {location.srs}
              </div>))
            }

            {
              this.props.trafficMessage.values.map((attribute: Value) => (<div  >
                {attribute.key} :  {attribute.value}
              </div>))
            }
          
          <Icon className="cancelIcon" onClick={this.closeModal}>cancel</Icon>
        </Modal>
      </div>

    );
  }
}