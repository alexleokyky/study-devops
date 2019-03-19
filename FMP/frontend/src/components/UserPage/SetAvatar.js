import React, {Component} from 'react';
import { Row, Col, Input, Button } from 'react-materialize';
import AvatarEditor from 'react-avatar-editor';
import {getAvatar, setUserAvatar} from '../../util/APIUtils';
import "../../styles/Avatar.css"


class SetAvatar extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyChangeAvatar = this.handleKeyChangeAvatar.bind(this);
        this.state = {
            avatar: "",
            changeAvatar: false,
            formChanged: false,
        };

    }

    componentDidMount() {
        getAvatar()
            .then(response => {
                if(response) {
                    this.setState({
                        avatar: response
                    })
                }
            })
    }

    handleChange(key, value) {
        this.setState({
            [key]: value,
            formChanged: true
        });
    }

    handleKeyChangeAvatar(event) {
        this.setState({
            changeAvatar: true
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.state.formChanged) {

            const image = this.editor.getImageScaledToCanvas();
            const dataURL = image.toDataURL();
            const file = this.toBlobFile(dataURL);

            this.setState({
                changeAvatar: false,
            });
            setUserAvatar(file)
                .then(response => {
                    if(response.ok) {
                        window.Materialize.toast("Avatar changed", 3000);
                        this.props.handleAvatarUpdated();
                    }
                });
        } else {
            this.setState({
                changeAvatar: false
            })
        }
    }

    toBlobFile(dataURL) {
        const blobBin = atob(dataURL.split(',')[1]);
        const array = [];
        for(let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        const file = new Blob([new Uint8Array(array)], {type: 'image/png'});

        return file;
    }

    setEditorRef = (editor) => this.editor = editor;

    renderChangeAvatarButton() {
        if(this.state.changeAvatar) {
            return(
                <React.Fragment>
                    <Row className="avatar-form">
                        <Input
                            type="file"
                            label="Choose file"
                            onChange={e => this.handleChange("avatar", e.target.files[0])}
                            accept="image/gif,image/jpeg,image/jpg,image/png"
                            s={11}
                        />
                    </Row>
                    <Row className="center-align">
                        <Button
                            type="submit"
                            className="red"
                            label="Choose file"
                            onClick={this.handleSubmit}
                        >
                            Save avatar
                        </Button>
                    </Row>
                </React.Fragment>
            )
        } else {
            return(
                <Row className="center-align">
                    <Button className="black" onClick={this.handleKeyChangeAvatar}>
                        Change avatar
                    </Button>
                </Row>
            )
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <AvatarEditor
                        ref={this.setEditorRef}
                        image={this.state.avatar}
                        width={300}
                        height={300}
                        border={20}
                        color={[0, 0, 0, 0.3]}
                    />
                </Row>
                <Row>
                    <Col s={6}>
                    {this.renderChangeAvatarButton()}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SetAvatar;