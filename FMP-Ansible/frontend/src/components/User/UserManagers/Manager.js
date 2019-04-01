import React, {Component} from "react";
import {Button, Card, CardTitle, Col, Row} from 'react-materialize';
import AppModal from "../../Modal/AppModal";
import './Manager.css';
import {addPlaceManager, deleteManagerByPlace, deletePlaceManager, getCurrentPlaces} from "../../../util/APIUtils";
import {Session} from "../../../utils";

class Manager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            places: [],
            showPlaces: false
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        const id = this.props.id;
        this.props.handleDelete(id);
    }


    handleFired(placeId, managerId) {
        deleteManagerByPlace(placeId, managerId)
            .then(result => {
                console.log(result);
                this.setState({
                    places: result,
                    showPlaces: false
                })
                window["Materialize"].toast("Manager fired", 3000);
            }).catch((error) => {
            window["Materialize"].toast(error.message, 3000);
        })
    }

    viewPlace() {
        const userId = Session.userId();
        console.log("USER_ID = " + userId);
        getCurrentPlaces(this.props.id, userId)
            .then(result => {
                this.setState({
                    places: result,
                    showPlaces: true
                })
            })
    }

    places() {
        console.log(this.state.places);
        return (
            <Row>
                {this.state.places.map((item) => (
                    <Row key={item.id}>
                        <Col s={4} offset="s4">
                            <p className="text-darken-2">{item.placeName}</p>
                        </Col>
                        <Col s={4}>
                            <Button className="btn-delete" waves='light' onClick={() => {
                                this.handleFired(item.placeId, item.userId);
                            }}>Fire</Button>
                        </Col>
                    </Row>
                ))}
            </Row>
        )
    }

    render() {
        const avatar = (this.props.avatarUrl != null) ? this.props.avatarUrl : 'img/avatar.png';
        console.log(this.state.showPlaces);
        return (
            <Card className='small' header={<CardTitle image={avatar}/>}>
                <Row className="place-info">
                    <Row className="place-name">
                        <span>{this.props.nickName}</span>
                    </Row>
                    <Row className="place-name">
                        <span>{this.props.email}</span>
                    </Row>
                    <Row className="place-name">
                        <span>{this.props.phone}</span>
                    </Row>
                    {(this.state.showPlaces) ? this.places() : ''}
                </Row>
                <Row className="additional-info">
                    <Col s={6} className="place-modal">
                        <Button className="black" waves='light' onClick={() => {
                            this.viewPlace()
                        }}>
                            Places
                        </Button>
                    </Col>
                    <Col s={6} className="place-modal">
                        <AppModal action={"Delete"}
                                  message={"Are you sure you want to delete this manager from all places?"}
                                  handleSubmit={this.handleDelete}
                                  buttonStyle="btn-delete"
                        />
                    </Col>
                </Row>
            </Card>
        );
    }

}

export default Manager;
