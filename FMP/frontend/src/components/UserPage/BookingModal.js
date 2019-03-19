import React, {Component} from 'react';
import {Button, Col, Icon, Input, Row} from 'react-materialize';
import Modal from 'react-responsive-modal';

class BookingModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            time: "00:00:00",
            open: false,
        };

        this.onBookCompleteHandler = this.onBookCompleteHandler.bind(this);
        this.openAndCloseModal = this.openAndCloseModal.bind(this);
    }

    openAndCloseModal() {
        this.setState({ open: !this.state.open });
    };

    render() {
        const {open} = this.state;

        return (
            <div>
                <div onClick={this.onBookNowHandler.bind(this)}>
                    <Col>
                        <Icon className="black-text" large>book</Icon>
                        <p className="text">Book Now</p>
                    </Col>
                </div>
                <Modal open={open} onClose={this.openAndCloseModal} blockScroll={false} center>
                    <Row className="modal-msg">
                        <h5>Booking</h5>
                    </Row>
                    <Row className="modal-msg">
                        <p>Please, check the time you want to book this place</p>
                    </Row>
                    <Row>
                        <Input
                            s={12}
                            type="time"
                            validate
                            required
                            label="Open time"
                            defaultValue="00:00"
                            options = {{twelvehour: false}}
                            onChange={e => this.onChangeTimeHandler("time", e.target.value)}
                        />
                    </Row>
                    <Row className="modal-btn">
                        <Button className="grey darken-4" onClick={this.onBookCompleteHandler}>Yes</Button>
                    </Row>
                </Modal>
            </div>
        );
    }

    onChangeTimeHandler(key, value) {
        this.setState({[key]: value});
    }

    onBookNowHandler() {
        this.setState({
            time: "00:00:00",
            open: true
        })
    }

    onBookCompleteHandler() {
        this.setState({ open: false });
        this.props.onBookCompleteHandler(this.state.time);
    }
}

export default BookingModal;