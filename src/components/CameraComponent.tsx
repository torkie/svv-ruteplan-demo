import { RoadFeature, Location, Value } from "../Model/RouteResponse";
import * as React from "react";
import Modal from 'react-modal';
import { times } from "lodash";

export interface ICameraComponentProps {
  roadCamera: RoadFeature;

}

interface ICameraComponentState {
  modalIsOpen: boolean;
  hyperLinkList: Array<Value>;
  unHyperLinkList: Array<Value>;

}
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '50%',
    width: '80%'
  },
  overlay: {
    zIndex: 10000
  }
};


export class CameraComponent extends React.Component<ICameraComponentProps, ICameraComponentState>{

  constructor(props: ICameraComponentProps) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalIsOpen: false,
      hyperLinkList: [...this.props.roadCamera.values.filter(x => x.key == "STILL_IMAGE_URL" || x.key == "VIDEO_URL" || x.key == "STILL_IMAGE_URL_DESCRIPTION")],
      unHyperLinkList: [...this.props.roadCamera.values.filter(x => x.key != "STILL_IMAGE_URL" && x.key != "VIDEO_URL" && x.key != "STILL_IMAGE_URL_DESCRIPTION")]
    };

  }

  showCameraDetails() {

    this.setState({ modalIsOpen: true });
  }


  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {

    return (

      <div >
        < img src="/images/icon-camera.png" height="20" style={{ cursor: "pointer" }} onClick={() => this.showCameraDetails()} />
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="cameraContent" >
            <h2> Vegkamera</h2>

            <div> Distanse langs segment : {this.props.roadCamera.distanceAlongSegment}  </div>
            {
              this.props.roadCamera.location.map((location: Location) => (<div  >
                Geometri N : {location.northing},E : {location.easting},SRS : {location.srs}
              </div>))
            }

            {
              this.state.hyperLinkList.map((attribute: Value) => (<div  >
                {attribute.key} : <a href={attribute.value} target="_blank">{attribute.value}</a>
              </div>))
            }

            {
              this.state.unHyperLinkList.map((attribute: Value) => (<div  >
                {attribute.key} : {attribute.value}
              </div>))
            }
          </div>
          <div style={this.footerStyle}>
            <button onClick={this.closeModal}>Lukk</button>
          </div>
        </Modal>
      </div>

    );
  }
  private footerStyle = {
    position: 'absolute' as 'absolute',
    right: 0,
    bottom: 0
  };

}