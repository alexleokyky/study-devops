import React, {Component} from 'react';
import {Button, Input, Row} from 'react-materialize';
import {Session} from "../../utils";
import {Redirect} from 'react-router-dom';
import "../../styles/RegisterPlace.css";
import '../../styles/Form.css';
import { withRouter } from "react-router-dom";

import EditImages from "./EditImages";
import {updatePlace} from "../../util/APIUtils";


class EditPlace extends Component {
    constructor(props) {
        super(props);

        this.isError = false;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateData = this.validateData.bind(this);
        this.state = {

            placeName: "",
            openTime: "00:00",
            closeTime: "00:00",
            placeType: "",
            description: "",
            ownerId: "",

            placeTypes: [],

            error_placeName: "",
            error_openTime: "",
            error_closeTime: "",
            error_placeType: "",
            error_description: "",

            redirect: !Session.isOwner(),
        }
    };


    validateData() {
        this.setState({
            error_placeName: "",
            error_placeType: "",
            error_description: "",
        });
        this.isError = false;

        if (this.state.placeName.trim().length === 0) {
            this.setState({
                error_placeName: "Place name is required field",
            });
            this.isError = true;
        }
        if (this.state.description.trim().length === 0) {
            this.setState({
                error_description: "Description is required field",
            });
            this.isError = true;
        }
    }

    handleChange(key, value) {
        this.setState({[key]: value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.validateData();

        if (!this.isError) {
            const updatePlaceRequest = {
                id: this.props.placeId,
                name: this.state.placeName,
                open: this.state.openTime + ":00",
                close: this.state.closeTime + ":00",
                placeType: this.state.placeType.value,
                description: this.state.description,
            };

            updatePlace(updatePlaceRequest)
                .then(response => {
                    window.Materialize.toast("Place successful updated", 7000);

                }).catch(error => {
                window.Materialize.toast("Sorry! Something went wrong. Please try again!", 7000);
            })

        } else {
            window.Materialize.toast("Check the fields", 3000);
        }
    }

    componentDidMount() {
        fetch("/places/types")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        placeTypes: result
                    });
                }
            );

        fetch("/places/" + this.props.placeId)
            .then(res => res.json())
            .then(place => {
                    if (place === null) {
                        this.setState({
                            redirect: true,
                        });
                        return;
                    }

                    if (place.banned) {
                        this.setState({
                            redirect: true
                        });
                    }

                    //Must be '!='. Don't touch this!
                    if (Session.userId() != place.ownerId) {
                        this.setState({
                            redirect: true,
                        });
                        return;
                    }

                    this.setState({
                        placeName: place.name,
                        openTime: place.open.substring(0, place.open.lastIndexOf(":00")),
                        closeTime: place.close.substring(0, place.close.lastIndexOf(":00")),
                        placeType: place.placeType,
                        description: place.description,
                    });
                }
            )
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/map'/>
        }
    };

    render() {

        const placeTypes = this.state.placeTypes;

        return (
            <div>
                {this.renderRedirect()}
                <Row>
                    <h1>Edit Information</h1>
                </Row>
                <Row>
                    <Input
                        id="placeName"
                        type="text"
                        value={this.state.placeName}
                        label="PLACE NAME"
                        error={this.state.error_placeName}
                        placeholder=" "
                        validate
                        required
                        s={12}
                        onChange={e => this.handleChange("placeName", e.target.value)}/>
                </Row>
                <Row>
                    <Input
                        type="time"
                        validate
                        required
                        label="OPEN TIME"
                        value={this.state.openTime}
                        options={{twelvehour: false}}
                        onChange={e => this.handleChange("openTime", e.target.value)}
                    />
                    <Input
                        type="time"
                        validate
                        required
                        label="CLOSE TIME"
                        value={this.state.closeTime}
                        options={{twelvehour: false}}
                        onChange={e => this.handleChange("closeTime", e.target.value)}
                    />
                </Row>
                <Row>
                    <Input
                        s={12}
                        type='select'
                        validate
                        required
                        error={this.state.error_placeType}
                        label="PLACE TYPE"
                        value={this.state.placeType.value}
                        onChange={e => this.handleChange("placeType", e.target.value)}>
                        {
                            placeTypes.map(type => (
                                <option key={type.name}
                                        value={type.value}
                                >{type.name}</option>
                            ))}
                    </Input>
                </Row>
                <Row>
                    <Input
                        type="textarea"
                        validate
                        required
                        label="DESCRIPTION"
                        error={this.state.error_description}
                        value={this.state.description}
                        s={12}
                        placeholder=" "
                        onChange={e => this.handleChange("description", e.target.value)}/>
                </Row>
                <Button className="grey darken-4" waves="light" onClick={this.handleSubmit}>
                    Save changes
                </Button>
            </div>
        );
    }
}

export default withRouter(EditPlace);