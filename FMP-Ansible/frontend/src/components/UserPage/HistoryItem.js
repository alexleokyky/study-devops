import React, {Component} from 'react';
import {Button, Card, CardTitle, Col, Row} from "react-materialize";
import StarRatings from 'react-star-ratings';
import {Link} from "react-router-dom";
import AppModal from "../Modal/AppModal";

// import "../User/UserPlaces/Place.css";
import "./History.css"
import {Session} from "../../utils";
import Moment from "react-moment";
import {deleteVisitHistoryItem} from "../../util/APIUtils";

export default class HistoryItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            placeName: "",
            placeRating: 0,
            imageUrl: "img/empty.png"
        };
    }

    componentDidMount() {
        fetch("/places/" + this.props.placeId)
            .then(res => res.json())
            .then(place => {
                    if (place != null) {
                        console.log(place);
                        this.setState({
                            placeName: place.name,
                            placeRating: place.rating,
                        });
                    }
                }
            );

        fetch("/places/download-images/" + this.props.placeId)
            .then(res => res.json())
            .then(
                (pictures) => {
                    if(pictures[0]) {
                        this.setState({
                            imageUrl: pictures[0].imageUrl,
                        });
                    }
                }
            );
    }

    deleteSubmit = () => {
        const id = this.props.id;

        deleteVisitHistoryItem(id);
    };

    render() {

        return (
            <div className="history-item-wrapper">
                <Row>
                    <Col>
                        <img className="history-img-wrapper" src={this.state.imageUrl} alt=""/>
                    </Col>
                    <Col>
                        <Row>
                            <div className="history-item-name">
                                <Link to={"../place/" + this.props.placeId}><p>{this.state.placeName}</p></Link>
                            </div>
                        </Row>
                        <Row>
                            <div className="history-item-rating">
                            <StarRatings
                                rating={this.state.placeRating}
                                starRatedColor="#ff8d15"
                                starDimension="20px"
                                starSpacing="5px"
                            />
                            </div>
                        </Row>
                        <Row>
                            <div className="history-visit-time">
                                <p>
                                    Visit time: <Moment format="DD MMM YYYY HH:mm">{this.props.visitTime}</Moment>
                                </p>
                            </div>
                        </Row>
                        <Row>
                            <AppModal
                                action="Delete from history"
                                message="Are you sure you want to delete this history item?"
                                buttonStyle="btn-delete"
                                handleSubmit={this.deleteSubmit}/>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
