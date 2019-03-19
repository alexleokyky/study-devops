import React, { Component } from 'react';
import { Button, Row } from 'react-materialize';
import Modal from 'react-responsive-modal';
import './AppModal.css';

export default class CancelBookingButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }

    openAndCloseModal() {}

    render() {
        return (
            <div>
                <Button onClick={this.openAndCloseModal}></Button>
                <Modal>
                    <Row className="modal-msg">
                        <p>{this.props.message}</p>
                    </Row>
                    <Row className="modal-btn">
                        <Button onClick={this.handleSubmit}>Yes</Button>
                    </Row>
                </Modal>
            </div>
        );
    }
}