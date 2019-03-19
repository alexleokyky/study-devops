import React, {Component} from 'react';
import {Button, Col, Icon, Row} from 'react-materialize';
import Modal from 'react-responsive-modal';
import "../../styles/Main.css";
import './AppModal.css';
import StarRatings from "react-star-ratings";

class MarkModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.openAndCloseModal = this.openAndCloseModal.bind(this);
        this.changeRating = this.changeRating.bind(this);

    }

    handleSubmit() {
        this.props.handleSubmit();
        this.setState({open: false});
    }

    openAndCloseModal() {
        if (this.props.isAuthenticated)
            this.setState({open: !this.state.open});
        else
            window.Materialize.toast('You\'re not logged in.', 1000);

    };

    changeRating(newRating) {
        this.props.changeRating(newRating);
        this.setState({open: false})
    }

    render() {
        const {open} = this.state;

        return (
            <div>
                <div onClick={this.openAndCloseModal} style={{cursor: "pointer"}}>
                    <Col>
                        <Icon className="black-text" large>star</Icon>
                        <p className="text">Rate Us</p>
                    </Col>
                </div>

                <Modal open={open} onClose={this.openAndCloseModal} blockScroll={false} center>
                    <Row className="modal-msg-rate">
                        <p>{this.props.message}</p>
                    </Row>
                    <Row> <StarRatings
                        rating={this.props.rating}
                        starRatedColor="#ff8d15"
                        starHoverColor="yellow"
                        starDimension="80px"
                        starSpacing="20px"
                        changeRating={this.changeRating}
                    /></Row>

                    <Row className="modal-btn">
                        <Button onClick={this.openAndCloseModal}>Cancel</Button>
                    </Row>
                </Modal>
            </div>
        );
    }

}

export default MarkModal;