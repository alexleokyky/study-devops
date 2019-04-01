import React, {Component} from 'react';
import {Button, Input, Row} from 'react-materialize';
import {Link} from 'react-router-dom';
import '../../styles/Form.css';
import {ACCESS_TOKEN, ROLE, USER_ID} from '../../constants';
import {login, resendEmail} from '../../util/APIUtils';
import LoadingIndicator from "../../common/LoadingIndicator";

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            role: '',
            usernameOrEmail: '',
            password: '',
            className: 'hidden',
            isLoading: false
        };
        this.onLogin = this.props.onLogin;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(key, value) {
        this.setState({[key]: value});
    }

    handleSubmit(event) {

        event.preventDefault();
        if (this.state.usernameOrEmail.trim().length === 0 || this.state.password.trim().length === 0) {
            window.Materialize.toast('Your Username or Password shouldn\'t be empty. Please try again!', 3000);
            this.setState({
                usernameOrEmail: "",
                password: "",
            });
        }
        else {


            const loginRequest = {
                usernameOrEmail: this.state.usernameOrEmail,
                password: this.state.password,
            };

            login(loginRequest)
                .then(response => {
                    console.log(response);

                    if (!response.active) {
                        this.setState({className: ""});

                    } else {

                        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                        localStorage.setItem(ROLE, JSON.stringify(response.role));
                        localStorage.setItem(USER_ID, response.userId);
                        const {from} = this.props.location.state || {from: {pathname: '/'}};
                        this.props.onLogin();
                        this.props.handleAvatarUpdated();
                        this.props.history.push(from);

                    }

                }).catch(error => {
                if (error.status === 401) {
                    window.Materialize.toast('Your Username or Password is incorrect. Please try again!', 3000);
                } else {
                    window.Materialize.toast('Sorry! Something went wrong. Please try again!', 3000);
                }
            });
        }

    }

    getNewEmailValidation() {
        this.setState({
            isLoading: true
        });


        resendEmail(this.state.usernameOrEmail).then(response => {
            this.setState({
                isLoading: false
            });
            window.Materialize.toast('The new message has been sent to your email!', 3000);

        }).catch(error => {
            if (error.status === 401) {
                window.Materialize.toast('Your Username or Password is incorrect. Please try again!', 3000);
            } else {
                window.Materialize.toast('Sorry! Something went wrong. Please try again!', 3000);
            }
        });
        this.setState({
            className: "hidden",
            usernameOrEmail: '',
            password: '',
        });

    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (
            <div className="form-wrapper">
                <div className="app-form">
                    <form onSubmit={this.handleSubmit}>
                        <div className={this.state.className}
                             style={{color: "#cc0000", textAlign: "center", fontSize: "22px"}}>

                            Your email address has not been verified.<br/>
                            <a href="../#/sign-in" onClick={() => this.getNewEmailValidation()}>
                                Click here for a new confirmation message!</a>

                        </div>

                        <h2>Sign In</h2>
                        <div className="errorMsg">{this.state.error}</div>
                        <Row>
                            <Input
                                id="usernameOrEmail"
                                value={this.state.usernameOrEmail}
                                placeholder="USERNAME or EMAIL"
                                onChange={e => this.handleChange("usernameOrEmail", e.target.value)}
                                s={12}
                            />
                        </Row>
                        <Row>
                            <Input
                                id="password"
                                type="password"
                                value={this.state.password}
                                placeholder="PASSWORD"
                                onChange={e => this.handleChange("password", e.target.value)}
                                s={12}
                            />
                        </Row>
                        <div className="confirm-row">
                            <Link className="forgot-password-link" to="/forgot-password">Forgot password?</Link>
                            <Button waves="light" id="sign-in" type="submit">Sign In</Button>

                        </div>
                    </form>
                </div>
            </div>
        );
    }

}

export default LoginForm;