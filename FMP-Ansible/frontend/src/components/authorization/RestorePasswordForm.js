import React, {Component} from 'react';
import {Button, Input, Row} from 'react-materialize';
import {withRouter} from 'react-router-dom';
import '../../styles/Form.css';
import {ACCESS_TOKEN, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH} from '../../constants';
import {login, restorePassword} from '../../util/APIUtils';
import LoadingIndicator from "../../common/LoadingIndicator";


class RestorePasswordForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirm_password: '',
            restoreToken: '',
            errors: {},
            isLoading: false

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(key, value) {
        this.setState({[key]: value});
    }

    handleSubmit(event) {

        event.preventDefault();

        if (this.validateForm()) {
            this.setState({
                isLoading: true
            });
            const restoreRequest = {
                password: this.state.password,
            };


            restorePassword(restoreRequest, this.props.match.params.token)
                .then(response => {

                    window.Materialize.toast('Password has been successfully changed!', 3000);
                    this.setState({
                        password: '',
                        confirm_password: '',
                        restoreToken: '',
                        errors: {}
                    });


                }).catch(error => {
                if (error.status === 401) {
                    window.Materialize.toast('You have already changed your password!', 3000);
                }
                else{
                    window.Materialize.toast('Sorry! Something went wrong. Please try again later!', 3000);}
                this.setState({
                    isLoading: false
                });

            });
            this.props.history.push("/");
        }
    }


    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (
            <div className="form-wrapper">
                <div className="app-form">
                    <form onSubmit={this.handleSubmit}>
                        <h2>Choose your new password</h2>
                        <Row>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={this.state.password}
                                placeholder="PASSWORD"
                                onChange={e => this.handleChange("password", e.target.value)}
                                s={12}
                            />
                            <div className="errorMsg">{this.state.errors.password}</div>
                        </Row>
                        <Row>
                            <Input
                                id="confirm_password"
                                type="password"
                                name="confirm_password"
                                value={this.state.confirm_password}
                                placeholder="CONFIRM PASSWORD"
                                onChange={e => this.handleChange("confirm_password", e.target.value)}
                                s={12}

                            />
                        </Row>
                        <Row>
                            <div className="errorMsg">{this.state.errors.confirm_password}</div>
                        </Row>
                        <div className="confirm-row">
                            <Button waves="light" type="submit">Confirm</Button>

                        </div>
                    </form>
                </div>
            </div>
        );
    }
    ;

    validateForm() {

        let errors = {};
        let formIsValid = true;

        if (this.state.password.trim().length === 0) {
            formIsValid = false;
            errors["password"] = "*Please enter your password.";
        }
        else if (this.state.password.length < PASSWORD_MIN_LENGTH) {
            formIsValid = false;
            errors["password"] = `*Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`;


        } else if (this.state.password.length > PASSWORD_MAX_LENGTH) {
            formIsValid = false;
            errors["password"] = `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`;
        }

        if (!this.state.confirm_password) {
            formIsValid = false;
            errors["confirm_password"] = "*Please confirm your password.";
        }
        else if (this.state.password !== this.state.confirm_password) {
            formIsValid = false;
            errors["confirm_password"] = "*Password doesn't match";
        }
        this.setState({
            errors: errors
        });
        return formIsValid;
    }

}

export default withRouter(RestorePasswordForm);