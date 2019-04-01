import React, {Component} from 'react';
import {Button, Row} from 'react-materialize';
import Modal from 'react-responsive-modal';
import "../../styles/Main.css";
import './AppModal.css';

class AppModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.openAndCloseModal = this.openAndCloseModal.bind(this);
    }

    handleSubmit() {
        this.props.handleSubmit();
        this.setState({ open: false });
    }

    openAndCloseModal() {
        this.setState({ open: !this.state.open });
    };

    render() {
        const {open} = this.state;

        return (
            <div>
                <Button className={this.props.buttonStyle} onClick={this.openAndCloseModal}>{this.props.action}</Button>
                <Modal open={open} blockScroll={false} onClose={this.openAndCloseModal} center>
                    <Row className="modal-msg">
                        <p>{this.props.message}</p>
                    </Row>
                    <Row className="modal-btn">
                        <Button className={this.props.buttonSubmitStyle} onClick={this.handleSubmit}>Yes</Button>
                        <Button className={this.props.buttonSubmitStyle} onClick={this.openAndCloseModal}>Cancel</Button>
                    </Row>
                </Modal>
            </div>
        );
    }

}

export default AppModal;