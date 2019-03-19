import React, {Component} from 'react';
import {Map, Marker, Popup, TileLayer, Tooltip} from 'react-leaflet'
import Place from "../../components/User/UserPlaces/Place";
import '../../styles/Map.css';


export default class MapLayout extends Component {

    render() {
        const currentPosition = [this.props.currentLatitude, this.props.currentLongitude]
        const position = [this.props.latitude, this.props.longitude]
        const zoom = this.props.zoom
        return (
                <Map center={position} zoom={zoom}>
                    <TileLayer
                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={currentPosition}>
                        <Tooltip direction="top" permanent={true}>
                            This is your current location.
                        </Tooltip>
                    </Marker>
                    {this.props.items.map(place => (
                        <Marker key={place.name} position={[place.latitude, place.longitude]}>
                            <Tooltip direction="top">
                                {place.name}
                            </Tooltip>
                            <Popup >
                                <div className="places-container map-place">
                                    <Place id={place.id}
                                           name={place.name}
                                           placeType={place.placeType.name}
                                           description={place.description}
                                           rating={place.rating}
                                           countFreePlaces={place.countFreePlaces}
                                           isApprove={place.approved}
                                           isRejected={place.rejected}
                                    />
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </Map>
        )
    }
}