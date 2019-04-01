import React, {Component} from 'react';
import {deleteUserPlace, getAllMyPlaces} from "../../../util/APIUtils";
import {Row} from "react-materialize";
import Place from "./Place";
import {Session} from "../../../utils";
import {Link, Redirect} from 'react-router-dom';
import PlacesFilter from "../../Admin/Places/Filter/PlacesFilter";
import '../../Admin/Places/Places.css';

class UserPlaces extends Component {

    constructor(props) {
        super(props);
        this.state = {
            places: [],
            filteredPlaces: []
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.renderRedirect = this.renderRedirect.bind(this);
    }

    componentDidMount() {
        getAllMyPlaces()
            .then((response) => {
                console.log(response);
                this.setState({
                    places: response,
                    filteredPlaces: response,
                });
            })
    };

    handleDelete(id) {
        deleteUserPlace(id)
            .then((data) => {
                let places = this.state.places.filter((place) => {
                    return id !== place.id;
                });

                this.setState({
                    places: places,
                    filteredPlaces: places
                });

                window["Materialize"].toast("Place deleted", 3000);
            }).catch((error) => {
                console.error('error', error);
            });
    };

    renderRedirect = () => {
        if (!Session.isLoggedIn()) {
            return <Redirect to='/'/>
        }
    };

    handleUpdate = (places) => {
        this.setState({
            filteredPlaces: places
        });
    };

    renderTop = () => {
        if(this.state.places.length === 0) {
            return(
                <Row className="missing-text">
                    <h3>You are not the owner. To become an owner, register at least one place.</h3>
                </Row>
            )
        } else {
            return(
                <React.Fragment>
                    <Row className="title">
                        <h5>Places</h5>
                    </Row>
                    <Row className="places-filter">
                        <PlacesFilter   places={this.state.places}
                                        filteredPlaces={this.state.filteredPlaces}
                                        handleUpdate={this.handleUpdate}
                        />
                    </Row>
                </React.Fragment>
            )
        }
    };

    render() {
        const places = this.state.filteredPlaces;

        return(
            <Row className="user-places-wrapper places-wrapper">
                {this.renderRedirect()}
                {this.renderTop()}
                <Row className="places-search">
                    <Link to={`/register-place`} id="register-place">Add place</Link>
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
                                       ownerId={item.ownerId}
                                       handleDelete={this.handleDelete}
                                />
                            )
                        )
                    }
                </Row>
            </Row>
        );
    };

}

export default UserPlaces;
