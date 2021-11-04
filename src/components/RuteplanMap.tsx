import * as React from "react";
import { Map, Marker, TileLayer, ZoomControl, GeoJSON, LayerGroup, Polyline} from 'react-leaflet';
import * as L from "leaflet";
import "proj4leaflet";
import Axios from "axios";
import { Feature } from "geojson";
import Modal from 'react-modal';
import { AddressItem } from "../Model/AddressItem";
import "leaflet-contextmenu";
import { IRouteResponse } from "../providers/RoutingService";
import { LeafletMouseEventHandlerFn } from "leaflet";

const position : L.LatLngExpression = [60.877003, 8.903530];
const mapResolutions = [
  21674.7100160867,
  10837.3550080434,
  5418.67750402168,
  2709.33875201084,
  1354.66937600542,
  677.334688002709,
  338.667344001355,
  169.333672000677,
  84.6668360003387,
  42.3334180001693,
  21.1667090000847,
  10.5833545000423,
  5.29167725002117,
  2.64583862501058,
  1.32291931250529,
  0.661459656252646
];

const crs = new L.Proj.CRS("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs", { resolutions: mapResolutions,
  //origin: [-3708422.0277, 10155660.624000002]
  origin: [-2500000.0, 9045984.0]
              }
);

interface IRuteplanMapState{
  ferries : any;
  modalIsOpen: boolean;
  modalFerryTitle: string;
  modalFerryUrl: string;
  
}
interface IRuteplanMapProps{
  fromLocation : AddressItem;
  toLocation : AddressItem;
  intermediateLocations?: AddressItem[];
  fromLocationChanged? : (item : AddressItem) => void;
  toLocationChanged? : (item : AddressItem) => void;
  intermediateLocationChanged? : (index: number, location : AddressItem) => void;
  routeResponse : IRouteResponse;
  selectedRouteIdx : number;
  routeSelected: (selectedRouteIdx: number) => void;
  pointBlocked: (pnt: L.LatLng) => void;
  blockedPointDragged: (i: number, pnt: L.LatLng) => void;
  blockedPoints: L.LatLng[];
}

const customStyles = {
  content : {
    top : '50%',
    left : '50%',
    right : 'auto',
    bottom : 'auto',
    marginRight : '-50%',
    transform : 'translate(-50%, -50%)',
    height: '95%',
    width: '95%'
  },
  overlay: {
    zIndex: 10000
  }
};

Modal.setAppElement('#main');

export class RuteplanMap extends React.Component<IRuteplanMapProps,IRuteplanMapState> {

  constructor(props: IRuteplanMapProps) {
    super(props);

    this.state = {
      ferries: null, 
      modalFerryTitle: null,
      modalIsOpen: false,
      modalFerryUrl: null
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount() {
      Axios.get("http://multirit.triona.se/tables/ferrypoints.json").then(data =>
      {
        this.setState({ferries: data.data});
      });
    }

    ferryPointToLayer = (point: Feature<any,any>, latlng: L.LatLng) : L.Layer =>
    {
      let myIcon = L.icon({
        iconUrl: 'images/ferry-icon.png',
        iconSize:     [10,10], // width and height of the image in pixels
        iconAnchor:   [5, 5], // point of the icon which will correspond to marker's location
      });
      var f = L.marker(latlng, { icon: myIcon, opacity: 0.5 });
      f.on("click", (e : L.LeafletMouseEvent) => {
        this.setState({modalIsOpen: true, modalFerryTitle: "Ferry: " + point.properties.route1, modalFerryUrl: point.properties.route1});
      });
      return f;
    }

    openModal() {
      this.setState({modalIsOpen: true});
    }
  
    afterOpenModal() {
      // references are now sync'd and can be accessed.
      //this.subtitle.style.color = '#f00';
    }
  
    closeModal() {
      this.setState({modalIsOpen: false});
    }

    fromLocationDragged = (e : L.DragEndEvent) => 
    {
      let pos = (e.target as L.Marker).getLatLng();
      this.setFromLocation({latlng: pos});
    }

    toLocationDragged = (e : L.DragEndEvent) => 
    {
      let pos = (e.target as L.Marker).getLatLng();
      this.setToLocation({latlng: pos});
    }

    viaLocationDragged = (i: number) => (e : L.DragEndEvent) => 
    {
      let pos = (e.target as L.Marker).getLatLng();
      if (this.props.intermediateLocationChanged)
      {
        this.props.intermediateLocationChanged(i,{name: "Punkt i kartet (" + pos.lat + ", " +pos.lng + ")", location: pos});
      }
    }

    blockedPointDragged = (i: number) => (e : L.DragEndEvent) => {
      let pos = (e.target as L.Marker).getLatLng();
      if (this.props.blockedPointDragged)
      {
        this.props.blockedPointDragged(i,pos);
      }
    }

    setFromLocation = (pos : { latlng : L.LatLng}) => {
      if (this.props.fromLocationChanged)
      {
        this.props.fromLocationChanged({name: "Punkt i kartet (" + pos.latlng.lat + ", " +pos.latlng.lng + ")", location: pos.latlng});
      }
    }
    setToLocation = (pos : { latlng : L.LatLng}) => {
      if (this.props.toLocationChanged)
      { 
        this.props.toLocationChanged({name: "Punkt i kartet (" + pos.latlng.lat + ", " +pos.latlng.lng + ")", location: pos.latlng});
      }
    }

    contextMenuAddIntermediate = (pos : { latlng : L.LatLng}) => {
        if (this.props.intermediateLocationChanged)
        {
          this.props.intermediateLocationChanged(-1,{name: "Punkt i kartet (" + pos.latlng.lat + ", " +pos.latlng.lng + ")", location: pos.latlng});
        }
      }

    contextMenuBlockPoint = (e:{ latlng : L.LatLng}) => {
      if (this.props.pointBlocked)
      {
        this.props.pointBlocked(e.latlng);
      }

    }

    render() {

        let contextMenuItems = [{
          text: '<i class="fa fa-play" style="color: green;margin-right: 5px"></i> Sett startpunkt',
          callback: this.setFromLocation
      }, {
          text: '<i class="fa fa-pause" style="color: rgb(238,146,46); margin-right: 5px"></i> Legg til viapunkt',
          callback: this.contextMenuAddIntermediate
      }, {
          text: '<i class="fa fa-stop" style="color: red;margin-right: 5px"></i> Sett Sluttpunkt',
          callback: this.setToLocation
      }, '-', {
          text: 'Blokker punkt',
          
          callback: this.contextMenuBlockPoint
      }];

        return <div><Map zoomControl={false} center={position} zoom={4} id="map" crs={crs} contextmenu={true} contextmenuItems={contextMenuItems}>
        <TileLayer
          attribution='&copy; NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)'
          url='https://nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}'
          subdomains="123456789"
          nowrap="true"
          maxzoom="{(crs as any).options.resolutions.length}"
          minzoom="0"
        />
        {this.state != null && this.state.ferries != null &&
          <GeoJSON key={this.state.ferries} data={this.state.ferries} pointToLayer={this.ferryPointToLayer} />
        }
        <LayerGroup>
          
          {this.props.fromLocation != null &&
          <Marker position={this.props.fromLocation.location} draggable={true} icon={this.fromMarkerIcon} onDragend={this.fromLocationDragged}  ></Marker>
          }

          {this.props.toLocation != null &&
          <Marker position={this.props.toLocation.location} draggable={true} icon={this.toMakerIcon} onDragend={this.toLocationDragged}></Marker>
          }
          
          {this.props.intermediateLocations != null && this.props.intermediateLocations.map((location,i) => {
            if (location != null)
            {
              return <Marker key={"via"+i} position={location.location} draggable={true} icon={this.viaMarkerIcon} onDragEnd={this.viaLocationDragged(i)}></Marker>  
            }
          })          
          }
          {this.props.blockedPoints != null && this.props.blockedPoints.map((location,i) => {
            if (location != null)
            {
              return <Marker key={"blocked"+i} position={location} draggable={true} icon={this.blockedPointIcon} onDragEnd={this.blockedPointDragged(i)}></Marker>  
            }
          })          
          }
        </LayerGroup>
        <LayerGroup>
          {this.props.routeResponse != null && this.props.routeResponse.features != null && this.props.routeResponse.features.map((f, i) => {
              return <Polyline key={"route_" + i} positions={(f.geometry as any).getLatLngs()} weight={5} opacity={0.9} color={i == this.props.selectedRouteIdx ? "#008CFF" : "#858585" } onclick={() => { if (this.props.routeSelected)  {this.props.routeSelected(i);}}}></Polyline>;
          })
          }
          </LayerGroup>
        <ZoomControl position="bottomleft"/>
        </Map>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
              <div style={this.wrapperStyle}>
                <div style={this.wrapperStyle}>
                  <iframe src={this.state.modalFerryUrl} style={this.iframeStyle} scrolling="yes"></iframe>
                </div>
                <div style={this.footerStyle}>
                  <button onClick={this.closeModal}>Steng</button>
                </div>
              </div>
          </Modal>
        </div>;
    }

    private fromMarkerIcon = new L.Icon({
      iconUrl:  '/images/frommarker.png',
      iconSize: [35,46],
      iconAnchor: [17,46]                        
    });

    private toMakerIcon = new L.Icon({
      iconUrl:  '/images/tomarker.png',
      iconSize: [35,46],
      iconAnchor: [17,46]                        
    });

    private viaMarkerIcon = new L.Icon({
      iconUrl:  '/images/viamarker.png',
      iconSize: [35,46],
      iconAnchor: [17,46]                        
    });
    private blockedPointIcon = new L.Icon({
      iconUrl:  '/images/block-icon.png',
      iconSize: [25,25],
      iconAnchor: [12,12]                        
    });

    private wrapperStyle = {
      position: 'relative' as 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%'
    };
    private footerStyle = {
      position: 'absolute' as 'absolute',
      right: 0,
      bottom: 0
    };
    private iframeStyle = {
      width: '100%',
      height: '100%',
      position: 'absolute' as 'absolute',
      top: '0',
      left: '0',
      border: '0'
    };

   
}
