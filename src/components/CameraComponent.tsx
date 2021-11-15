import { RoadFeature, Location, Value } from "../Model/RouteResponse";
import * as React from "react";
import Modal from 'react-modal';
import { Icon } from "@material-ui/core";


export interface ICameraComponentProps {
  roadCamera: RoadFeature;
}

interface ICameraComponentState {
  modalIsOpen: boolean;
  imageUrl: string;
  roadCameraValues: Array<Value>;

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
    width: 'fit-content',
    overflow: 'none'
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
      roadCameraValues: new Array<Value>(),
      imageUrl: ""
    };

  }

  componentWillMount() {
    const cameraImageList = [...this.props.roadCamera.values.filter(x => x.key == "STILL_IMAGE_URL")];
    const imageUrl = cameraImageList[0].value;
    const roadCameraValues = [...this.props.roadCamera.values.filter(x => x.key != "STILL_IMAGE_URL")];

    this.setState({
      imageUrl: imageUrl,
      roadCameraValues: roadCameraValues
    });
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
          <div className="cameraContent">
            <h2> Vegkamera</h2>

            <div> Distanse langs segment : {this.props.roadCamera.distanceAlongSegment}  </div>
            {
              this.props.roadCamera.location.map((location: Location) => (<div  >
                Geometri N : {location.northing},E : {location.easting},SRS : {location.srs}
              </div>))
            }

            {
              this.state.roadCameraValues.map((attribute: Value) => (<div  >
                {attribute.key} :  {attribute.key == "VIDEO_URL" || attribute.key == "STILL_IMAGE_URL_DESCRIPTION" ? <a href={attribute.value} target="_blank">{attribute.value}</a> : attribute.value}
              </div>))
            }
            <img src={this.state.imageUrl} alt="camera" width="500" height="auto" />
          </div>
          <Icon className="cancelIcon" onClick={this.closeModal}>cancel</Icon>
        </Modal>
      </div>

    );
  }
}