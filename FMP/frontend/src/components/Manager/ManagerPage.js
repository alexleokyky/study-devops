import React, { Component } from 'react';
import ManagerProfile from "../UserPage/Profile";
import ManagerBookings from "./ManagerBookings";
import {approveBooking, getManagerBookings, getUserProfile, rejectBooking} from "../../util/APIUtils";
import {Link, withRouter} from "react-router-dom";
import {Col, Row, Tab, Tabs} from "react-materialize";

export class ManagerPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            phone: "",
            avatar: "",
            oldPassword: "",
            newPassword: "",
            bookings: [],
            // adminProfileIsOpened: false,
            // usersListIsOpened: false,
            profileIsOpened: true,
            approvePlacesIsOpened: false
        };
    }

    render() {
        return (
            <div className="admin-page-wrapper">
                <Row className="admin-page">
                    <Col s={2} className="admin-menu-wrapper">
                        <div className="admin-menu">
                            <Row className="admin-avatar">
                                <img src="img/admin/admin-avatar.png" alt="avatar"/>
                            </Row>
                            <Row className="admin-name">
                                {this.props.firstName} {this.props.lastName}
                            </Row>
                            <Row className="admin-menu-items">
                                <Row>
                                    <Link to="#" onClick={this.showProfile.bind(this)}>
                                        <img src="img/admin/user.png" alt="user"/>
                                        Profile
                                    </Link>
                                </Row>
                                <Row>
                                    <Link to="#" onClick={this.showBookings.bind(this)}>
                                        <img src="img/admin/users.png" alt="users"/>
                                        Bookings
                                    </Link>
                                </Row>
                            </Row>
                        </div>
                    </Col>
                    <Col s={10} className="admin-view-features">
                        <Row className={!this.state.profileIsOpened ? 'hidden' : 'feature-row'}>
                            <Tabs className="tab-menu">
                                <Tab className="tab-menu-item" active>
                                    <ManagerProfile firstName={this.state.firstName}
                                                  lastName={this.state.lastName}
                                                  email={this.state.email}
                                                  userName={this.state.userName}
                                                    handleAvatarUpdated={this.props.handleAvatarUpdated}
                                                    handleRefresh={this.handleRefresh.bind(this)}
                                    />
                                </Tab>
                            </Tabs>
                        </Row>
                        <Row className={!this.state.bookingsIsOpened ? 'hidden' : 'feature-row'}>
                            <ManagerBookings
                                bookings={this.state.bookings}
                                approveBooking={this.approveBooking.bind(this)}
                                rejectBooking={this.rejectBooking.bind(this)}
                            />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }

    componentDidMount() {
        getUserProfile()
            .then((profile) => {
                const userId = this.props.userId;

                getManagerBookings(userId)
                    .then(bookings => {
                        console.log("bookings:", bookings);

                        this.setState({
                            firstName: profile['firstName'],
                            lastName: profile['lastName'],
                            userName: profile['username'],
                            email: profile['email'],
                            phone: profile['phone'],
                            avatar: profile['avatar'],
                            bookings: bookings
                        });
                    })
                    .catch(error => console.log("error", error));
            });
    }

    handleRefresh() {
        this.componentDidMount();
    }

    hideComponents() {
        this.state.profileIsOpened = false;
        this.state.bookingsIsOpened = false;
    }

    showProfile() {
        this.hideComponents();
        this.state.profileIsOpened = true;
    }

    showBookings() {
        this.hideComponents();
        this.state.bookingsIsOpened = true;
    }

    showError(message) {
        window["Materialize"]['toast'](message, 3000);
    }

    approveBooking(id) {
        approveBooking(id)
            .then(response => {
                const userId = this.props.userId;

                getManagerBookings(userId)
                    .then(bookings => {
                        this.setState({
                            bookings: bookings
                        });
                    })
                    .catch(error => this.showError(error.message));
            })
            .catch(error => this.showError(error.message));
    }

    rejectBooking(id) {
        rejectBooking(id)
            .then(response => {
                const userId = this.props.userId;

                getManagerBookings(userId)
                    .then(bookings => {
                        this.setState({
                            bookings: bookings
                        });
                    })
                    .catch(error => this.showError(error.message));
            })
            .catch(error => this.showError(error.message));
    }
}

export default withRouter(ManagerPage);
