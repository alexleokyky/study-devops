import React, {Component} from "react";
import {Button, Col, Row} from "react-materialize";
import ImageUploader from "react-images-upload";
import Gallery from 'react-grid-gallery';
import {deletePlaceImage, uploadPlaceImages} from "../../util/APIUtils";
import AppModal from "../Modal/AppModal";
import "./EditPlace.css"

class EditImages extends Component {
    constructor(props) {
        super(props);

        this.onDrop = this.onDrop.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSelectImage = this.onSelectImage.bind(this);
        this.handleDeleteImages = this.handleDeleteImages.bind(this);
        this.state = {
            picturesFromServer: [],
            pictures: [],
            visible: false,
            preview: false,
            uploaderKey: 0,
            countSelectedImages: 0,
        }
    };

    handleSubmit(event) {
        event.preventDefault();

        uploadPlaceImages(this.state.pictures, this.props.placeId)
            .then(response => {
                if (response.ok) {
                    this.setState({
                        pictures: [],
                        uploaderKey: this.state.uploaderKey + 1,
                    });
                    this.downloadImages();
                }
            })
    }

    downloadImages = () => {
        fetch("/places/download-images/" + this.props.placeId)
            .then(res => res.json())
            .then(
                (pictures) => {

                    const picturesFromServer = [];
                    pictures.map((image) => {
                        picturesFromServer.push({
                            imageUrl: image.imageUrl,
                            src: image.imageUrl,
                            thumbnail: image.imageUrl,
                            thumbnailWidth: 500,
                            thumbnailHeight: 350,
                        })
                    });

                    this.setState({
                        picturesFromServer: picturesFromServer,
                    });
                }
            );
    };

    componentDidMount() {
        this.downloadImages();
    }

    onDrop(pictureFiles, pictureDataURLs) {
        this.setState({
            pictures: pictureFiles,
            preview: true,
        });
    }

    handleDeleteImages() {

        //Returns not deleted images
        const imagesAfterDelete = this.state.picturesFromServer.filter(image => {
            if(image.isSelected) {
                deletePlaceImage(image.imageUrl)
                    .then(result => {
                        if(result.ok)
                        return !result.ok;
                    });
            } else {
                return true;
            }
        });

        this.setState({
            picturesFromServer: imagesAfterDelete,
            countSelectedImages: 0,
        })
    }

    onSelectImage(index, image) {
        console.log("ok" + index);
        let images = this.state.picturesFromServer.slice();
        let countSelectedImages = this.state.countSelectedImages;
        let img = images[index];

        if (img.hasOwnProperty("isSelected")) {
            img.isSelected = !img.isSelected;
            img.isSelected ? countSelectedImages++ : countSelectedImages--;
        } else {
            img.isSelected = true;
            countSelectedImages++;
        }

        this.setState({
            picturesFromServer: images,
            countSelectedImages: countSelectedImages,
        });
    };

    renderSendButton = () => {
        if (this.state.pictures.length > 0) {
            return (
                <Button className="grey darken-4" waves='light' onClick={this.handleSubmit}>SEND TO SERVER</Button>
            )
        }
    };

    renderDeleteButton = () => {
        if(this.state.countSelectedImages > 0) {
            return(
                <Row>
                    <AppModal action={"DELETE SELECTED IMAGES"}
                              message={"Are you sure you want to delete this images?"}
                              buttonStyle="red"
                              handleSubmit={this.handleDeleteImages}
                    />
                </Row>
            )
        }
    };

    renderGallery = () => {
        if(this.state.picturesFromServer.length > 0) {
            return(
                <Row className="gallery-container">
                    <Gallery
                        images={this.state.picturesFromServer}
                        onSelectImage={this.onSelectImage}
                        preloadNextImage={false}/>
                </Row>
            )
        } else {
            return (
                <Row>
                    <h3 align="left">There are no images yet</h3>
                </Row>
            )
        }
    };

    render() {
        return (
            <div className="edit-image">
                <Row>
                    <h1>Edit Pictures</h1>
                </Row>
                {this.renderGallery()}
                {this.renderDeleteButton()}
                <Row>
                    <ImageUploader key={this.state.uploaderKey}
                                   withIcon={false}
                                   buttonText='ADD IMAGES'
                                   className="upload-container"
                                   buttonClassName="upload-btn black btn"
                                   withLabel={false}
                                   onChange={this.onDrop}
                                   withPreview={this.state.preview}
                                   imgExtension={['.jpg', '.gif', '.png', '.gif', 'jpeg']}
                                   maxFileSize={5242880}
                    />
                </Row>
                {this.renderSendButton()}
            </div>
        );
    }
}

export default EditImages;