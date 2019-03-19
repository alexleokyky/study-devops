import React, {Component} from "react";
import Modal from 'react-responsive-modal';
import {Button, Col, Input, Row} from "react-materialize";
import "./EmailModal.css"

class EmailModal extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openAndCloseModal = this.openAndCloseModal.bind(this);

        this.state = {
            isOpen: false,
            subject: "",
            message: "",
        }
    }

    handleSubmit(subject, message) {
        this.props.handleSubmit(subject, message);
        this.setState({ isOpen: false });
    }

    handleChange(key, value) {
        this.setState({
            [key]: value,
        });
    }

    openAndCloseModal() {
        this.setState({ isOpen: !this.state.isOpen });
    };

    render() {

        const {isOpen} = this.state;

        return(
            <React.Fragment>
                <Button className={this.props.buttonStyle} onClick={this.openAndCloseModal}>{this.props.action}</Button>
                <Modal className="email-container" styles={{
                    modal: {
                        width: 800,
                    }
                }}
                       open={isOpen}
                       blockScroll={false}
                       onClose={this.openAndCloseModal}
                       header={this.props.header}
                       showCloseIcon={false}
                       closeOnOverlayClick={false}
                >
                    <div>
                        <b>Write email</b>
                    </div>
                    <div className="email-container">
                        <Input
                            s={12}
                            placeholder="SUBJECT"
                            onChange={e => this.handleChange("subject", e.target.value)}/>
                        <Input
                            s={12}
                            type='textarea'
                            placeholder="MESSAGE"
                            onChange={e => this.handleChange("message", e.target.value)}/>
                        <Row style={{margin: 0}}>
                            <Col className="right">
                                <Button
                                    waves="light"
                                    className="black"
                                    onClick={this.openAndCloseModal}>Close</Button>
                            </Col>
                            <Col className="right">
                                <Button
                                    className="black"
                                    waves="light"
                                    onClick={() => this.handleSubmit(this.state.subject, this.state.message)}
                                >
                                    Send
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }

}

export default EmailModal;