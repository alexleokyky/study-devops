import React, {Component} from 'react';
import {Button, Col, Icon, Row} from 'react-materialize';
import '../../styles/PlacePage.css';
import {Session} from "../../utils";

class Info extends Component {

    constructor(props) {
        super(props);
        this.state = {
            manageFreePlaces: (Session.isManager() || Session.isOwner()),
            accessUser: false
        };
    }

    componentDidMount() {
        console.log("PLACE_ID = " + this.props.placeId);
        const userId = Session.userId();
        fetch("/places/" + this.props.placeId + "/access-user/" + userId)
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    accessUser: result
                });
            })
    }

    viewButton() {
        return (
            <Row className="managers-container">
                <Col>
                    <Button className="black" waves='light' onClick={() => {
                        this.props.countChange(-1)
                    }}>
                        <Icon>remove</Icon>
                    </Button>
                </Col>
                <Col>
                    <p>Free places: {this.props.freePlaces}</p>
                </Col>
                <Col>
                    <Button className="black" waves='light' onClick={() => {
                        this.props.countChange(1)
                    }}>
                        <Icon>add</Icon>
                    </Button>
                </Col>
            </Row>
        )
    }

    // renderPlaceImage = () => {
    //     if(this.props.placeImage) {
    //         return(
    //             <Col className="image-container" s={6}>
    //                 <img className="place-image" src={this.props.placeImage.imageUrl}/>
    //             </Col>
    //         )
    //     } else {
    //         return(
    //             <Col className="image-container" s={6}>
    //                 <img className="place-image" src="./img/empty.png"/>
    //             </Col>
    //         )
    //     }
    // };

    render() {
        console.log("accessUser = " + this.state.accessUser);
        console.log("managerFreePlaces = " + this.state.manageFreePlaces);
        console.log("show? = " + this.state.manageFreePlaces && this.state.accessUser);
        return (
            <div>
                <Row>
                    <h1>Information</h1>
                </Row>
                <Row>
                    <Col className="image-container" s={6}>
                        <img
                            className="place-image"
                            src={this.props.placeImage ? this.props.placeImage.imageUrl : "./img/empty.png"}/>
                    </Col>
                    <Col s={6}>
                        <p>Open time: {this.props.openTime}</p>
                        <p>Close time: {this.props.closeTime}</p>
                        {(this.state.manageFreePlaces && this.state.accessUser) ? this.viewButton() : <p>Free places: {this.props.freePlaces}</p>}
                        <p>{this.props.description}</p>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Info;