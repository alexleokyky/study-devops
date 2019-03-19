import React, {Component} from "react";
import {Card, CardTitle, Col, Row} from 'react-materialize';
import {Link} from "react-router-dom";
import StarRatings from 'react-star-ratings';
import AppModal from "../../Modal/AppModal";
import './Place.css';
import {Session} from "../../../utils";
import InputModal from "../../Modal/InputModal";

class Place extends Component {

    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleBan = this.handleBan.bind(this);
        this.viewModalWindow = this.viewModalWindow.bind(this);

        this.state = {
            imageUrl: "",
        }
    }

    componentDidMount() {
        fetch("/places/download-images/" + this.props.id)
            .then(res => res.json())
            .then(
                (pictures) => {

                    if(pictures[0]) {
                        this.setState({
                           imageUrl: pictures[0].imageUrl,
                        });
                    }

                    // const picturesFromServer = [];
                    // pictures.map((image) => {
                    //     picturesFromServer.push({
                    //         imageUrl: image.imageUrl,
                    //         src: image.imageUrl,
                    //         thumbnail: image.imageUrl,
                    //         thumbnailWidth: 500,
                    //         thumbnailHeight: 350,
                    //     })
                    // });
                    //
                    // this.setState({
                    //     picturesFromServer: picturesFromServer,
                    // });
                }
            );
    }

    handleDelete() {
        const id = this.props.id;
        this.props.handleDelete(id);
    }

    handleBan(message) {
        const id = this.props.id;
        this.props.handleBan(id, message);
    }

    viewModalWindow() {
        if(Session.isAdmin() || (Session.isOwner() && Session.userId() == this.props.ownerId)) {
            const style = "black padding-left" + ((this.props.isBanned === false && this.props.showBan === true) ? "" : " hidden");

            return (
                <Row>
                    <Col s={4}>
                        <InputModal
                            header="Write the reason of bun"
                            actionName="Ban"
                            buttonClassName={style}
                            modalTitle="Write the reason of bun"
                            handleAction={this.handleBan}
                        />
                    </Col>
                    <Col offset="s4" s={4}>
                        <AppModal action={"Delete"}
                                  message={"Are you sure you want to delete this place?"}
                                  buttonStyle="btn-delete"
                                  handleSubmit={this.handleDelete}
                        />
                    </Col>
                </Row>
            )

        }
    }

    renderEdit = () => {
        if((Session.isOwner() && Session.userId() == this.props.ownerId)) {
            return(
                <Link to={`/edit-place/${this.props.id}`}>(Edit place)</Link>
            )
        }
    };

    renderForApproved() {
        if(this.props.isApprove) {
            return(
                <Row className="place-rating">
                    <StarRatings
                        rating={this.props.rating}
                        starRatedColor="#ff8d15"
                        starDimension="20px"
                        starSpacing="5px"
                    />
                </Row>
            )
        } else if(this.props.isRejected) {
            return(
                <Row>
                    <h5>Status: <span style={{color: 'red'}}>rejected</span></h5>
                </Row>
            )
        } else {
            return(
                <Row>
                    <h5>Status: <span style={{color: 'orange'}}>wait for approve</span></h5>
                </Row>
            )
        }
    }

    render() {
        return(
            <Card
                className='small'
                header={<CardTitle image={this.state.imageUrl ? this.state.imageUrl : 'img/empty.png'}/>}
            >
                <Row className="place-info">
                    <Row className="place-type">
                        <span>{this.props.placeType}</span>
                    </Row>
                    {this.renderForApproved()}
                    <Row className="place-name">
                        <Link to={`/place/${this.props.id}`}>{this.props.name}</Link>
                    </Row>
                    <Row>
                        {this.renderEdit()}
                    </Row>
                    <Row className="place-description">
                        <span>{this.props.description}</span>
                    </Row>
                </Row>

                <Row className="additional-info">
                    <Col s={4} className="free-places">
                        Free places: {this.props.countFreePlaces}
                    </Col>
                    <Col s={8} className="place-modal">
                        {this.viewModalWindow()}
                    </Col>
                </Row>
            </Card>
        );
    }

}

export default Place;
