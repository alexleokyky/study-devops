import React, { Component } from 'react';
import {Row, Input, Button, Col} from 'react-materialize';
import {withRouter} from "react-router-dom";
import "./ContactUs.css"
import {emailToAdmin, registerPlace} from "../../util/APIUtils";

class ContactUs extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.state = {
            email: "",
            subject: "",
            message: "",
        };
        this.isError = false;
    };

    componentDidMount() {
        if(this.props.isAuthenticated) {
            this.setState({
                email: this.props.currentUser.email,
            });
        }
    }

    handleChange(key, value) {
        this.setState({
            [key]: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.validateForm();

        if(!this.isError) {
            const emailToAdminRequest = {
                userEmail: this.state.email,
                subject: this.state.subject,
                message: this.state.message,
            };

            emailToAdmin(emailToAdminRequest)
                .then(response => {
                    this.props.history.goBack();
                    window.Materialize.toast("Email has been sent", 3000);
                }).catch(err => {
                console.log(err);
                window.Materialize.toast("Server error", 3000);
            })
        }
    }

    renderEmailInput = () => {
        if(!this.props.isAuthenticated) {
            return(
                <Input
                    s={12}
                    label=" "
                    placeholder="YOUR EMAIL"
                    validate
                    required
                    onChange={e => this.handleChange("email", e.target.value)}/>
            );
        }
    };

    validateForm() {
        this.isError = false;
        if(this.state.email.trim().length === 0) {
            this.isError = true;
            window.Materialize.toast('Email is required field', 3000);
        } else {
            //regular expression for email validation
            let pattern = new RegExp(/.+@.+\..+/i);
            if (!pattern.test(this.state.email)) {
                this.isError = true;
                window.Materialize.toast('Please, enter valid email', 3000);
            }
        }
    };

    render() {
        return(
            <div className="contact-form-wrapper">
                <div className="contact-form">
                    <h3>Contact Us</h3>
                    {this.renderEmailInput()}
                    <Input
                        s={12}
                        placeholder="SUBJECT"
                        onChange={e => this.handleChange("subject", e.target.value)}/>
                    <Input
                        s={12}
                        type='textarea'
                        placeholder="HOW CAN WE HELP YOU?"
                        onChange={e => this.handleChange("message", e.target.value)}/>
                    <Row style={{margin: 0}}>
                        <Col s={12} className="center-align">
                            <Button
                                className="black"
                                waves="light"
                                onClick={this.handleSubmit}
                            >
                                Send email
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default withRouter(ContactUs);