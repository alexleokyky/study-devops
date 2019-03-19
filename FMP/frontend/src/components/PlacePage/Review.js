import React, {Component} from 'react';
import {Col, Row} from 'react-materialize';
import Moment from 'react-moment';
import "../../styles/Main.css";
import './Review.css';
import AppModal from "../Modal/AppModal";

class Review extends Component {

    constructor(props) {
        super(props);

        this.state = {
            style: "menu-container",
            role: this.props.currentUser == null ? "" : this.props.currentUser.role,
            basicUserId: this.props.currentUser == null ? "" : this.props.currentUser.id,
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.viewDeleteButton = this.viewDeleteButton.bind(this);
    }

    handleDelete() {
        const id = this.props.id;
        this.props.handleDelete(id);
    }

    viewDeleteButton() {
        if (this.state.role === "ROLE_ADMIN" || this.props.userId === this.state.basicUserId) {
            return (
                <AppModal action={"Delete"}
                          message={"Are you sure you want to delete this comment?"}
                          buttonStyle="btn-delete"
                          handleSubmit={this.handleDelete}
                />
            )
        }
    }

    render() {
        return (
            <Row className="review-container">
                <Col s={1} className="img-block">
                    <img src={this.props.avatar}/>
                </Col>
                <Col s={11} >
                    <Row className="review-author">
                        <span>{this.props.userName}</span>
                    </Row>
                    <Row className="review-text">
                        <span className="comment_text">{this.props.comment} </span>
                    </Row>
                    <Row className="review-creation-date">
                        <Moment format="DD MMM YYYY HH:mm">
                            {this.props.creationDate}
                        </Moment>
                        {this.viewDeleteButton()}
                    </Row>
                </Col>
            </Row>
        );
    }

}

export default Review;