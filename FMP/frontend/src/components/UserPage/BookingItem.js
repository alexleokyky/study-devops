import React, { Component } from 'react';
import { Col, Row} from 'react-materialize';
import AppModal from "../Modal/AppModal";
import "../../styles/Booking.css";

const STATUS = [
    "SENT",
    "APPROVED",
    "CLOSED"
];

export default class BookingItem extends Component {
    render() {
        const booking = this.props["booking"];

        return (
            <div className="booking-item-wrapper">
                <Row>
                    <div className="booking-item-title-wrapper">
                        <p>{booking.placeName}</p>
                    </div>
                </Row>
                <Row>
                    <Col>
                        <img className="place-img-wrapper" src="img/place.jpg" alt=""/>
                    </Col>
                    <Col>
                        <Row>
                            { this.renderUserOrStatus() }
                        </Row>

                        <Row>
                            <Col>
                                <p>Booking time: {booking.bookingTime}</p>
                            </Col>
                        </Row>

                        {this.renderButtons()}
                    </Col>
                </Row>
            </div>
        );
    }

    renderUserOrStatus() {
        const isManager = this.props["isManager"] === true;
        const booking = this.props["booking"];

        if (isManager) {
            return (
                <Col>
                    <p>User: {booking.userName}</p>
                </Col>
            );
        }

        return (
            <Col>
                <p>Status: {STATUS[booking.status]}</p>
            </Col>
        );
    }

    renderButtons() {
        const isManager = this.props["isManager"] === true;

        if (isManager) {
            return (
                <Row>
                    <Col>
                        <AppModal action={"Approve"}
                                  buttonStyle="black padding-left"
                                  buttonSubmitStyle="grey darken-4"
                                  message={"Are you sure you want to approve this booking?"}
                                  handleSubmit={this.onApproveBookingHandler.bind(this)}
                        />
                    </Col>
                    <Col>
                        <div style={{minWidth: "10px"}}></div>
                    </Col>
                    <Col>
                        <AppModal action={"Reject"}
                                  buttonStyle="red"
                                  buttonSubmitStyle="grey darken-4"
                                  message={"Are you sure you want to reject this booking?"}
                                  handleSubmit={this.onRejectBookingHandler.bind(this)}
                        />
                    </Col>
                </Row>
            );
        }

        return (
            <Row>
                <Col>
                    <AppModal action={"Cancel"}
                              buttonStyle="black"
                              buttonSubmitStyle="grey darken-4"
                              message={"Are you sure you want to cancel this booking?"}
                              handleSubmit={this.onCancelBookingHandler.bind(this)}
                    />
                </Col>
            </Row>
        );
    }

    onApproveBookingHandler() {
        const id = this.props["booking"]["id"];
        const approveBooking = this.props["approveBooking"];

        if (approveBooking) {
            approveBooking(id);
        }
    }

    onRejectBookingHandler() {
        const id = this.props["booking"]["id"];
        const rejectBooking = this.props["rejectBooking"];

        if (rejectBooking) {
            rejectBooking(id);
        }
    }

    onCancelBookingHandler() {
        const id = this.props["booking"]["id"];
        const cancelBooking = this.props["cancelBooking"];

        if (cancelBooking) {
            cancelBooking(id);
        }
    }
}