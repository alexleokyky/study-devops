import React, {Component} from 'react';
import {Button, Col, Input, Row} from "react-materialize";

class PlacesFilter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            placeTypes: [],
            selectedPlaceType: "None",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        fetch("/places/types")
            .then((response) => response.json())
            .then((result) => {
                    this.setState({
                        placeTypes: result
                    });
                }
            )
    }

    handleChange(key, value) {
        this.setState({[key]: value});
        this.handleFilter();
    }

    handleFilter() {
        let places = this.props.places.filter((place) => {
            if ((this.state.selectedPlaceType === "None")) {
                return !place;
            } else {
                return place.placeType.name !== this.state.selectedPlaceType;
            }
        });

        this.props.handleUpdate(places);
    }

    render() {
        const places = this.state.placeTypes;

        return (
            <Row className="filter-wrapper">
                <Col s={3} className="filter-places">
                    <Input  type='select'
                            label="Place Type"
                            onChange={e => this.handleChange("selectedPlaceType", e.target.value)}>
                            <option key="None" value="None">All</option>
                            {
                                places.map((place) => (
                                    <option key={place.name} value={place.name}>{place.name}</option>
                                ))
                            }
                    </Input>
                </Col>
            </Row>
        );
    }

}

export default PlacesFilter;