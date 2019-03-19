import React, {Component} from "react";
import {Button, Card, CardTitle, Col, Row} from "react-materialize";
import {Link} from "react-router-dom";
import AppModal from "../../../Modal/AppModal";

export default class BanPlace extends Component {
    constructor(props) {
        super(props);

        this.onUnbanPlace = this.onUnbanPlace.bind(this);

        this.state = {
            imageUrl: "",
        }
    }


    render() {
        return (
            <Card className='small'
                  header={<CardTitle image={this.state.imageUrl ? this.state.imageUrl : 'img/empty.png'}/>} >
                <Row className="place-info">
                    <Row className="place-type">
                        <span>{this.props.placeType}</span>
                    </Row>
                    <Row className="place-name">
                        <Link to={`/place/${this.props.placeId}`}>{this.props.name}</Link>
                    </Row>
                    <Row className="place-description">
                        <span>{this.props.description}</span>
                    </Row>
                </Row>

                <Row>

                    <Col offset="s6" s={6}>
                        <AppModal action={"Unban"}
                                  message={"Are you sure you want to unban this place?"}
                                  buttonStyle="btn-delete"
                                  handleSubmit={this.onUnbanPlace}
                        />
                    </Col>

                </Row>
            </Card>
        );
    }

    componentDidMount() {
        fetch("/places/download-images/" + this.props.id)
            .then(res => res.json())
            .then(
                (pictures) => {
                    if(pictures[0]) {
                        this.setState({
                            imageUrl: pictures[0].imageUrl,
                        });
                    }
                }
            );
    }

    onUnbanPlace() {
        this.props.unbanPlace(this.props.placeId);
    }

}