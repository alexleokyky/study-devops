import React, { Component } from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import '../../styles/RegisterPlace.css';

class PutMarker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            center: {
                lat: this.props.lat,
                lng: this.props.lng,
            },
            marker: {
                lat: this.props.lat,
                lng: this.props.lng,
            },
            zoom: this.props.zoom,
            draggable: true,
        }
    }

    refmarker = React.createRef()

    toggleDraggable = () => {
        this.setState({ draggable: !this.state.draggable })
    }

    updatePosition = () => {
        const { lat, lng } = this.refmarker.current.leafletElement.getLatLng()
        this.setState({
            marker: { lat, lng },
        });
        if(this.props.handleCoordinates) this.props.handleCoordinates(lat, lng)
    }

    render() {
        const position = [this.state.center.lat, this.state.center.lng]
        const markerPosition = [this.state.marker.lat, this.state.marker.lng]

        return (
            <Map className="map-container" center={position} zoom={this.state.zoom}>
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    draggable={this.state.draggable}
                    onDragend={this.updatePosition}
                    position={markerPosition}
                    ref={this.refmarker}>
                    <Popup minWidth={90}>
            <span onClick={this.toggleDraggable}>
              {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
            </span>
                    </Popup>
                </Marker>
            </Map>
        )
    }
}

export default PutMarker;