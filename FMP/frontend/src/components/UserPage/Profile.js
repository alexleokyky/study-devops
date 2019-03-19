import React, {Component} from 'react';
import {Col, Row, Input, Button} from 'react-materialize';
import {USER_ID} from "../../constants/index";
import {updateUserPassword, updateUserProfile} from "../../util/APIUtils";
import SetAvatar from "./SetAvatar";

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: props.firstName,
            lastName: props.lastName,
            userName: props.userName,
            email: props.email,
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
    }

    handleChange(key, value) {
        this.setState({[key]: value});
    }

    message = (text) => {
        window["Materialize"].toast(text, 2000);
    };

    updateProfile() {
        const firstName = this.state.firstName;
        const lastName = this.state.lastName;
        const userName = this.state.userName;
        const email = this.state.email;
        const oldPassword = this.state.oldPassword;

        if (firstName.length < 3) {
            this.message("Please enter your first name");
            return;
        }

        if (lastName.length < 3) {
            this.message("Please enter your last name");
            return;
        }

        if (userName.length < 3) {
            this.message("Please enter your username");
            return;
        }

        const pattern = new RegExp((/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i));
        if (!pattern.test(email)) {
            this.message("Please enter valid e-mail");
            return;
        }

        console.clear();
        console.log(oldPassword);

        if (!oldPassword.length) {
            this.message("Please enter your password");
            return;
        }

        const userId = localStorage.getItem(USER_ID);
        const profile = {
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            nickName: userName,
            email: email,
            password: oldPassword
        };

        updateUserProfile(profile)
            .then(response => {
                this.message(response.message);
                this.props.handleRefresh();
            })
            .catch(error => this.message(error.message));
    }

    updatePassword() {
        const oldPassword = this.state.oldPassword;
        const newPassword = this.state.newPassword;
        const confirmPassword = this.state.confirmPassword;

        if (newPassword.length < 3) {
            this.message("You have to enter your new password");
            return;
        }

        if (!oldPassword.length) {
            this.message("You have to enter your old password");
            return;
        }

        if (newPassword !== confirmPassword) {
            this.message("Passwords doesn't match");
            return;
        }

        const userId = localStorage.getItem(USER_ID);
        const password = {
            userId: userId,
            password: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };

        updateUserPassword(password)
            .then(response => {
                this.message(response.message);
                this.props.handleRefresh();
            })
            .catch(error => this.message(error.message));
    }

    render() {
        return (
            <div className="admin-profile-wrapper">
                <Row>
                    <Col s={6} className="admin-update-profile">
                        <Row className="admin-update">
                            <img src="img/admin/update.png" alt="update"/>
                            Update Profile
                        </Row>
                        <Row className="admin-profile-field">
                            <Col s={4}>
                                <p>First Name:</p>
                            </Col>
                            <Col s={8}>
                                <Input defaultValue={this.props.firstName}
                                       onChange={e => this.handleChange("firstName", e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="admin-profile-field">
                            <Col s={4}>
                                <p>Last Name:</p>
                            </Col>
                            <Col s={8}>
                                <Input defaultValue={this.props.lastName}
                                       onChange={e => this.handleChange("lastName", e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="admin-profile-field">
                            <Col s={4}>
                                <p>Username:</p>
                            </Col>
                            <Col s={8}>
                                <Input defaultValue={this.props.userName}
                                       onChange={e => this.handleChange("userName", e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="admin-profile-field">
                            <Col s={4}>
                                <p>Email:</p>
                            </Col>
                            <Col s={8}>
                                <Input defaultValue={this.props.email}
                                       onChange={e => this.handleChange("email", e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="admin-profile-btn">
                            <Col s={6}>
                                <Button onClick={this.updateProfile}>Save</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col s={6}>
                        <SetAvatar handleAvatarUpdated={this.props.handleAvatarUpdated}/>
                    </Col>
                </Row>

                <Row className="admin-update-password">
                    <Col s={12}>
                        <Row className="admin-update">
                            <img src="img/admin/update.png" alt="update"/>
                            Update Password
                        </Row>
                        <Row className="admin-profile-field">
                            <Col s={2} className="field-name">
                                <p>Old Password:</p>
                            </Col>
                            <Col s={3}>
                                <Input type="password"
                                       onChange={e => this.handleChange("oldPassword", e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="admin-profile-field">
                            <Col s={2} className="field-name">
                                <p>New password:</p>
                            </Col>
                            <Col s={3}>
                                <Input type="password"
                                       onChange={e => this.handleChange("newPassword", e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="admin-profile-field">
                            <Col s={2} className="field-name">
                                <p>Confirm new password:</p>
                            </Col>
                            <Col s={3}>
                                <Input type="password"
                                       onChange={e => this.handleChange("confirmPassword", e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className="admin-profile-btn">
                            <Col s={3}>
                                <Button onClick={this.updatePassword}>Save</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Profile;

/*
import React, {Component} from 'react';
import {Row, Col, Input, Button} from 'react-materialize';

import BasePage from "./BasePage";
import {updateProfile} from "../../util/APIUtils";
import {USER_ID} from "../../constants";

import '../../styles/UserPage.css';
import SetAvatar from "./SetAvatar";

export default class Profile extends BasePage {
    constructor(props) {
        super(props);

        this.state = {
            firstName: props.firstName,
            lastName: props.lastName,
            userName: props.userName,
            email: props.email,
            phone: props.phone,
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    }

    render() {
        return (
            <div ref="root" className="container">
                <div className="profile-editor">
                    <Row>
                        <Col offset="s4">
                            <SetAvatar handleAvatarUpdated={this.props.handleAvatarUpdated}/>
                        </Col>
                    </Row>
                    <Row className="user-page">
                        <Col s={4} offset="s2">
                            <p>first name:</p>
                        </Col>
                        <Col s={4}>
                            <Input
                                defaultValue={this.props.firstName}
                                onChange={(e) => {
                                    this.onChangeStateHandler('firstName', e.target.value)
                                }}/>
                        </Col>
                    </Row>
                    <Row className="user-page">
                        <Col s={4} offset="s2">
                            <p>last name:</p>
                        </Col>
                        <Col s={4}>
                            <Input
                                defaultValue={this.props.lastName}
                                onChange={(e) => {
                                    this.onChangeStateHandler('lastName', e.target.value)
                                }}/>
                        </Col>
                    </Row>

                    <Row className="user-page">
                        <Col s={4} offset="s2">
                            <p>name:</p>
                        </Col>
                        <Col s={4}>
                            <Input
                                defaultValue={this.props.userName}
                                onChange={(e) => {
                                    this.onChangeStateHandler('userName', e.target.value)
                                }}/>
                        </Col>
                    </Row>

                    <Row className="user-page">
                        <Col s={4} offset="s2">
                            <p>email:</p>
                        </Col>
                        <Col s={4}>
                            <Input defaultValue={this.props.email}
                                   onChange={(e) => {
                                       this.onChangeStateHandler('email', e.target.value)
                                   }}/>
                        </Col>
                    </Row>

                    <Row className="user-page">
                        <Col s={4} offset="s2">
                            <p>phone:</p>
                        </Col>
                        <Col s={4}>
                            <Input defaultValue={this.props.phone}
                                   onChange={(e) => {
                                       this.onChangeStateHandler('phone', e.target.value)
                                   }}/>
                        </Col>
                    </Row>

                    <Row className="user-page">
                        <Col s={4} offset="s2">
                            <p>password:</p>
                        </Col>
                        <Col s={4}>
                            <Input type="password"
                                   onChange={(e) => {
                                       this.onChangeStateHandler('oldPassword', e.target.value)
                                   }}/>
                        </Col>
                    </Row>

                    <Row className="user-page">
                        <Col s={4} offset="s2">
                            <p>new password:</p>
                        </Col>
                        <Col s={4}>
                            <Input type="password"
                                   onChange={(e) => {
                                       this.onChangeStateHandler('newPassword', e.target.value)
                                   }}/>
                        </Col>
                    </Row>

                    <Row className="user-page">
                        <Col s={4} offset="s2">
                            <p>confirm password:</p>
                        </Col>
                        <Col s={4}>
                            <Input type="password"
                                   onChange={(e) => {
                                       this.onChangeStateHandler('confirmPassword', e.target.value)
                                   }}/>
                        </Col>
                    </Row>

                    <Row className="user-page">
                        <Col s={2} offset="s5">
                            <Button onClick={this.onSaveChangesHandler.bind(this)}>Save</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

    error(message) {
        window["Materialize"].toast(message, 1500);
    }

    onChangeStateHandler(key, value) {
        this.setState({[key]: value});
    }

    onSaveChangesHandler() {
        const {
            firstName,
            lastName,
            userName,
            email,
            phone,
            oldPassword,
            newPassword,
            confirmPassword
        } = this.state;

        if (!oldPassword.length) {
            this.error("You have to enter your password");
            return;
        }

        if (!firstName.length) {
            this.error("You have to enter valid firstName");
            return;
        }

        if (!lastName.length) {
            this.error("You have to enter valid lastName");
            return;
        }

        if (!/^\d+$/.test(phone)) {
            this.error("You have to enter valid phone");
            return;
        }

        if (newPassword.length) {
            if (!oldPassword.length) {
                this.error("You have to enter your old password");
                return;
            }

            if (!confirmPassword.length) {
                this.error("You have to confirm new password!");
                return;
            }

            if (newPassword !== confirmPassword) {
                this.error("Passwords doesn't match");
                return;
            }
        }

        const userId = localStorage.getItem(USER_ID);

        const profile = {
            firstName: firstName,
            lastName: lastName,
            userId: userId,
            nickName: userName,
            email: email,
            phone: phone,
            password: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };

        updateProfile(profile)
            .then(response => {
                this.error(response.message);
            });
    }
}
*/