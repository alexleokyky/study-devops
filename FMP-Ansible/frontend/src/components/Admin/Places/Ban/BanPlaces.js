import React, { Component } from "react";
import BanPlace from "./BanPlace";
import {unbanPlace} from "../../../../util/APIUtils";
import {Row} from "react-materialize";
import PlacesFilter from "../Filter/PlacesFilter";

export default class BanPlaces extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filteredPlaces: []
        };

        this.onUnbanPlace = this.onUnbanPlace.bind(this);
    }

    render() {
        const places = this.getPlaces();

        return (
            <Row className="user-places-wrapper">
                <Row className="title">
                    <h5>Places</h5>
                </Row>
                <Row className="places-filter">
                    <PlacesFilter   places={ this.props.places }
                                    filteredPlaces={ this.state.filteredPlaces }
                                    handleUpdate={ this.filterList.bind(this) }
                    />
                </Row>
                <Row className="places-container">
                    {
                        this.emptyList(places)
                    }
                    {
                        places.map(place => (
                            <BanPlace placeId={place.id}
                                      key={place.id}
                                      name={place.name}
                                      placeType={place.placeType.name}
                                      description={place.description}
                                      unbanPlace={this.onUnbanPlace}
                            />
                        ))
                    }
                </Row>
            </Row>
        );
    }

    emptyList = (places) => {
        if(places.length === 0) {
            return(
                <h3>There are no places to in ban list</h3>
            )
        }
    };

    filterList(places) {
        this.setState({
            filteredPlaces: places
            });
    }

    getPlaces() {
        const otherPlaces = this.state.filteredPlaces;

        return this.props.places.filter(place => {
            return otherPlaces.indexOf(place) == -1 && place.banned;
        });
    }

    onUnbanPlace(placeId) {
        unbanPlace(placeId)
            .then(response => {
                this.props.onUnbanPlaceHandler();
            })
            .catch(error => console.log(error));
    }
}