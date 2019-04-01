import React, {Component} from "react";
import {Card, CardTitle, Col, Row, Button} from "react-materialize";
import {Link} from "react-router-dom";
import {approvePlace, rejectPlace} from "../../util/APIUtils";
import InputModal from "../Modal/InputModal";

class ApprovablePlace extends Component {

    constructor(props) {
        super(props);

        this.handleApprove = this.handleApprove.bind(this);
        this.handleReject = this.handleReject.bind(this);
    }

    handleApprove() {
        approvePlace(this.props.placeId)
            .then(response => {
                if(response.success) {
                    window.Materialize.toast("Place approved", 1500);
                    this.props.handleUpdate();
                }
                else window.Materialize.toast(response.message, 1500);
            });
    };

    handleReject(message) {

        const data = {
            placeId: this.props.placeId,
            rejectMessage: message,
        };

        rejectPlace(data)
            .then(response => {
                if(response.success) {
                    window.Materialize.toast("Place rejected", 1500);
                    this.props.handleUpdate();
                }
                else window.Materialize.toast(response.message, 1500);
            });
    }

    render() {
        return(
            <Card className='small' header={<CardTitle image='img/place.jpg'/>} >
                <Row className="place-info">
                    <Row className="place-type">
                        <span>{this.props.placeType}</span>
                    </Row>
                    <Row className="place-name">
                        <Link to={`/place/${this.props.placeId}`}>{this.props.name}</Link>
                    </Row>
                    <Row>
                        <span>{this.props.description}</span>
                    </Row>
                </Row>

                <Row>
                    <Col s={6}>
                        <Button className="black" waves="light" onClick={this.handleApprove}>Approve</Button>
                    </Col>
                    <Col s={6}>
                        <InputModal
                            header="Write the reason of reject"
                            actionName="reject"
                            buttonClassName="red"
                            modalTitle="Write the reason of reject"
                            handleAction={this.handleReject}/>
                    </Col>
                </Row>
            </Card>
        );
    }

}

export default ApprovablePlace
