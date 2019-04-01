import React, {Component} from "react";
import {Input, Col, Button, Row} from "react-materialize";
import Modal from 'react-responsive-modal';
import {rejectPlace} from "../../util/APIUtils";

class InputModal extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            isOpen: false,
            message: ""
        }
    }

    handleOpen = () => {
        this.setState({isOpen: true})
    };

    handleClose = () => {
        this.setState({isOpen: false});
    };

    handleChange(key, value) {
        this.setState({
            [key]: value,
        });
    }

    handleSubmit() {
        const message = this.state.message;
        this.props.handleAction(message);
        this.handleClose();
    };

    render() {

        const {isOpen} = this.state;

        return(
            <div>
                <Button
                    onClick={this.handleOpen}
                    className={this.props.buttonClassName}
                    waves="light">
                    {this.props.actionName}
                </Button>
                <Modal styles={{
                            modal: {
                                width: 800,
                            }
                       }}
                       open={isOpen}
                       onClose={this.handleClose}
                       header={this.props.header}
                       showCloseIcon={false}
                       closeOnOverlayClick={false}
                       blockScroll={false}
                >
                    <div>
                        <b>{this.props.modalTitle}</b>
                    </div>
                    <Input
                        s={12}
                        type='textarea'
                        onChange={e => this.handleChange("message", e.target.value)}/>
                    <Row style={{margin: 0}}>
                        <Col className="right">
                            <Button
                                waves="light"
                                className="black"
                                onClick={this.handleClose}
                            >
                                Close
                            </Button>
                        </Col>
                        <Col className="right">
                            <Button
                                className={this.props.buttonClassName}
                                waves="light"
                                onClick={this.handleSubmit}
                            >
                                {this.props.actionName}
                            </Button>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default InputModal