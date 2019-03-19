import React, {Component} from 'react';
import {CardPanel, Col, Icon, Row} from 'react-materialize';
import {Link} from 'react-router-dom';
import '../../styles/PlacePage.css';
import BookingModal from "../UserPage/BookingModal";
import MarkModal from "../Modal/MarkModal";

class ButtonsBlock extends Component {
    constructor(props) {
        super(props);
        this.action = this.action.bind(this);

    }

    action() {
        return (
            <MarkModal rating={this.props.rating}
                       changeRating={this.props.changeRating}
                       message={"Rate this place"}
                       isAuthenticated={this.props.isAuthenticated}/>
        )
    }

    render() {
        return (
            <CardPanel className="card-panel-btn blue lighten-5">
                <Row className="center">
                    <Link to={{
                        pathname: '/map',
                        state: {
                            latitude: this.props.latitude,
                            longitude: this.props.longitude,
                        }
                    }}>
                        <Col>
                            <Icon className="black-text" large>place</Icon>
                            <p className="text">On the map</p>
                        </Col>
                    </Link>
                    <div onClick={() => { this.props.addToFavorite(!this.props.favorite); }}>
                        <Col>
                            <Icon className="black-text" large>{ this.getIcon() }</Icon>
                            <p className="text">{ this.getText() }</p>
                        </Col>
                    </div>
                    <BookingModal onBookCompleteHandler={this.props.onBookCompleteHandler}/>
                    {this.action()}
                </Row>
            </CardPanel>
        );
    }

    getIcon() {
        return this.props.favorite ? "mood_bad" : "mood";
    }

    getText() {
        return this.props.favorite ? "Remove favorite" : "Add favorite";
    }
}

export default ButtonsBlock;