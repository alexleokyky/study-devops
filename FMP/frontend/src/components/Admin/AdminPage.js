import React, {Component} from 'react';
import {Col, Row, Tab, Tabs} from "react-materialize";
import {getUserProfile} from "../../util/APIUtils";
import {USER_ID} from "../../constants";
import AdminProfile from "../UserPage/Profile";
import {Link, Redirect, withRouter} from "react-router-dom";
import UsersList from "./Users/UsersList";
import Places from "./Places/Places";
import './AdminPage.css';
import {Session} from "../../utils";
import ApprovablePlaces from "../ApprovePlace/ApprovablePlaces";
import BanPlaces from './Places/Ban/BanPlaces';

class AdminPage extends Component {

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
            places: [],
            adminProfileIsOpened: true,
            usersListIsOpened: false,
            placesIsOpened: false,
            approvePlacesIsOpened: false,
            banPlaceIsOpened: false
        };

        this.hideComponents = this.hideComponents.bind(this);
        this.showProfile = this.showProfile.bind(this);
        this.showUsersList = this.showUsersList.bind(this);
        this.showPlaces = this.showPlaces.bind(this);
        this.showApprovePlaces = this.showApprovePlaces.bind(this);
        this.renderRedirect = this.renderRedirect.bind(this);
        this.showBanPlaces = this.showBanPlaces.bind(this);
    }

    updateList() {
        const userId = localStorage.getItem(USER_ID);

        getUserProfile(userId)
            .then((response) => {
                fetch("/map")
                    .then((response) => response.json())
                    .then((places) => {
                        console.log(places);

                        this.setState({
                            firstName: response['firstName'],
                            lastName: response['lastName'],
                            userName: response['username'],
                            email: response['email'],
                            phone: response['phone'],
                            avatar: response['avatar'],
                            places: places
                        });
                    });
            });
    }

    componentDidMount() {
        this.updateList();
    }

    hideComponents(){
        this.state.adminProfileIsOpened = false;
        this.state.usersListIsOpened = false;
        this.state.placesIsOpened = false;
        this.state.approvePlacesIsOpened = false;
        this.state.banPlaceIsOpened = false;
    }

    showProfile() {
        this.hideComponents();
        this.state.adminProfileIsOpened = true;
    }

    showBanPlaces() {
        this.hideComponents();
        this.state.banPlaceIsOpened = true;
    }

    showUsersList() {
        this.hideComponents();
        this.state.usersListIsOpened = true;
    }

    showPlaces() {
        this.hideComponents();
        this.state.placesIsOpened = true;
    }

    showApprovePlaces() {
        this.hideComponents();
        this.state.approvePlacesIsOpened = true;
    }

    renderRedirect = () => {
        if (!Session.isAdmin()) {
            return <Redirect to='/'/>
        }
    };

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
                                    <Link to="#" onClick={this.showProfile}>
                                        <img src="img/admin/user.png" alt="user"/>
                                        Profile Settings
                                    </Link>
                                </Row>
                                <Row>
                                    <Link to="#" onClick={this.showUsersList}>
                                        <img src="img/admin/users.png" alt="users"/>
                                        Users
                                    </Link>
                                </Row>
                                <Row>
                                    <Link to="#"  onClick={this.showPlaces}>
                                        <img src="img/admin/place.png" alt="place"/>
                                        Places
                                    </Link>
                                </Row>
                                <Row>
                                    <Link to="#"  onClick={this.showApprovePlaces}>
                                        <img src="img/admin/add-place.png" alt="place"/>
                                        Approve/Reject places
                                    </Link>
                                </Row>
                                <Row>
                                    <Link to="#" onClick = { this.showBanPlaces }>
                                        <img src="img/admin/ban-place.png" alt="place"/>
                                        Ban Place
                                    </Link>
                                </Row>
                            </Row>
                        </div>
                    </Col>
                    <Col s={10} className="admin-view-features">
                        <Row className={!this.state.adminProfileIsOpened ? 'hidden' : 'feature-row'}>
                            <Tabs className="tab-menu">
                                <Tab className="tab-menu-item" active>
                                    <AdminProfile firstName={this.state.firstName}
                                                  lastName={this.state.lastName}
                                                  email={this.state.email}
                                                  userName={this.state.userName}
                                                  handleAvatarUpdated={this.props.handleAvatarUpdated}
                                                  handleRefresh={this.handleRefresh.bind(this)}
                                    />
                                </Tab>
                            </Tabs>
                        </Row>
                        <Row className={!this.state.usersListIsOpened ? 'hidden' : 'feature-row'}>
                            <UsersList/>
                        </Row>
                        <Row className={!this.state.placesIsOpened ? 'hidden' : 'feature-row'}>
                            <Places
                                places = { this.state.places }
                                onDeletePlaceHandler = { this.onDeletePlaceHandler.bind(this) }
                                onBanPlaceHandler = { this.onBanPlaceHandler.bind(this) }
                            />
                        </Row>
                        <Row className={!this.state.approvePlacesIsOpened ? 'hidden' : 'feature-row'}>
                            <ApprovablePlaces/>
                        </Row>
                        <Row className={!this.state.banPlaceIsOpened ? 'hidden' : 'feature-row'}>
                            <BanPlaces
                                places = { this.state.places }
                                onUnbanPlaceHandler = { this.onUnbanPlaceHandler.bind(this) }
                            />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }

    handleRefresh() {
        this.componentDidMount();
    }

    onDeletePlaceHandler() {
        this.updateList();
    }

    onBanPlaceHandler() {
        this.updateList();
    }

    onUnbanPlaceHandler() {
        this.updateList();
    }
}

export default withRouter(AdminPage);