import React, {Component} from 'react';
import {banPlace, deleteUserPlace} from "../../../util/APIUtils";
import {Row} from "react-materialize";
import Place from "../../User/UserPlaces/Place";
import PlacesFilter from "./Filter/PlacesFilter";
import './Places.css';

class Places extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // places: [],
            filteredPlaces: []
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleBan = this.handleBan.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleDelete(id) {
        deleteUserPlace(id)
            .then((data) => {
                this.props.onDeletePlaceHandler();
                window["Materialize"].toast("Place deleted", 3000);
            }).catch((error) => {
            console.error('error', error);
        });
    };

    handleBan(placeId, message) {
        console.log("ban place: ", placeId, message);

        banPlace(placeId, message)
            .then(response => {
                this.props.onBanPlaceHandler();
            })
            .catch(error => console.log(error));
    }

    handleUpdate = (places) => {
        this.setState({
            filteredPlaces: places
        });
    };

    render() {
        const places = this.getPlaces();

        return(
            <Row className="places-wrapper">
                <Row className="title">
                    <h5>Places</h5>
                </Row>
                <Row className="places-filter">
                    <PlacesFilter   places={this.props.places}
                                    filteredPlaces={this.state.filteredPlaces}
                                    handleUpdate={this.handleUpdate}
                    />
                </Row>
                <Row className="places-container">
                    {
                        places.map((item) => (
                                <Place id={item.id}
                                       key={item.id}
                                       name={item.name}
                                       placeType={item.placeType.name}
                                       description={item.description}
                                       rating={item.rating}
                                       countFreePlaces={item.countFreePlaces}
                                       isApprove={item.approved}
                                       isRejected={item.rejected}
                                       isBanned={item.banned}
                                       showBan={true}
                                       ownerId={item.ownerId}
                                       handleDelete={this.handleDelete}
                                       handleBan={this.handleBan}
                                />
                            )
                        )
                    }
                </Row>
            </Row>
        );
    }

    getPlaces() {
        const otherPlaces = this.state.filteredPlaces;

        return this.props.places.filter(place => {
            console.log(place.id, otherPlaces.indexOf(place));
            return otherPlaces.indexOf(place) == -1
        });
    }
}

export default Places;