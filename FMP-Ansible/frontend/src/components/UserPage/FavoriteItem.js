import React, {Component} from 'react';
import {Button, Card, CardTitle, Col, Row} from "react-materialize";
import StarRatings from 'react-star-ratings';
import {Link} from "react-router-dom";
import AppModal from "../Modal/AppModal";

import "../Admin/Places/Places.css";

export default class FavoriteItem extends Component {
    render() {
        console.log(this.props);

        return (
            <Col>
                <Card className='small' header={ <CardTitle image='img/place.jpg'/> }>
                    <Row className="place-rating">
                        <StarRatings
                            rating={this.props.rating}
                            starRatedColor="#ff8d15"
                            starDimension="20px"
                            starSpacing="5px"
                        />
                    </Row>

                    <Row className="place-name">
                        <Link to={`/place/${this.props.id}`}>{this.props.name}</Link>
                    </Row>

                    <Row className="place-description">
                        <span>{this.props.description}</span>
                    </Row>

                    <Row className="additional-info">
                        <Col s={6} className="free-places">
                            Free places: {this.props.countFreePlaces}
                        </Col>
                    </Row>
                    <Row>
                        <Col s={6} className="free-places">
                            <Button className={"btn-book grey darken-4"} onClick={() => { this.props.bookPlace(this.props.id); }}>Book</Button>
                        </Col>
                        <Col s={6} className="free-places">
                            <AppModal action={"Delete"}
                                      message={"Are you sure you want to remove this place from favorites?"}
                                      buttonStyle="btn-delete"
                                      handleSubmit={() => { this.props.removeFavorite(this.props.id); }}
                            />
                        </Col>
                    </Row>
                </Card>
            </Col>
        );
    }
}
