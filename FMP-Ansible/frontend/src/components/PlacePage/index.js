import React, {Component} from 'react';
import {Row} from 'react-materialize';
import '../../styles/PlacePage.css';
import ButtonsBlock from './ButtonsBlock.js';
import ReviewsBlock from './ReviewsBlock.js';
import ManagersBlock from './ManagersBlock.js';
import Info from './Info.js';
import {addFavorite, changeCountFreePlaces, checkFavorite, removeFavorite} from "../../util/APIUtils";
import {checkBookingTime, PAGE_CHANGED, Session} from "../../utils";
import {bookPlace} from "../../util/APIUtils";
import StarRatings from "react-star-ratings";
import {addMark} from '../../util/APIUtils';
import Gallery from "react-grid-gallery";
import {withRouter} from 'react-router-dom';

const toast = window["Materialize"].toast;


class PlacePage extends Component {

    constructor(props) {
        super(props);

        this.changeRating = this.changeRating.bind(this);
        this.state = {
            place: {},
            picturesFromServer: [],
            rating: 0,
            favorite: false,
            viewManager: Session.isOwner(),
        };

        // this.state = {
        //     place: {},
        //     viewManager: Session.isOwner()
        // };
    }

    componentWillMount() {
        window.dispatchEvent(new CustomEvent(PAGE_CHANGED, {
            detail: {
                show: true,
                name: "place-page"
            }
        }));
    }

    componentDidMount() {
        fetch("/places/" + this.props.match.params.placeId)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.banned) {
                        this.props.history.push("/");
                        return;
                    }

                    checkFavorite(result.id).then((favorite => {
                        this.setState({
                            place: result,
                            rating: result.rating,
                            favorite: favorite
                        });
                    }));
                }
            );

        this.downloadImages();
    }

    downloadImages = () => {
        fetch("/places/download-images/" + this.props.match.params.placeId)
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

    changeRating(newRating) {
        const markRequest = {
            mark: newRating,
            userId: this.props.currentUser.id,
            placeId: this.state.place.id
        };

        addMark(markRequest)
            .then(response => {
                this.setState({
                    rating: response,
                });
            }).catch(error => {
            if (error.status === 401) {
                this.props.handleLogout();
                window.Materialize.toast('You are not logged in!', 1000);
            } else {
                window.Materialize.toast('Sorry! Something went wrong. Please try again!', 1000);
            }
        });


    }

    viewManagers() {
        if (this.state.viewManager && (Session.userId() == this.state.place.ownerId)) {
            return (
                <ManagersBlock
                    placeId={this.props.match.params.placeId}
                />
            )
        }
    }

    countChange = (count) => {
        changeCountFreePlaces(this.props.match.params.placeId, count)
            .then((result) => {
                this.setState({
                    place: result
                });
            }).catch((error) => {
            console.error('error', error);
        });
    };

    renderGallery = () => {

        if(this.state.picturesFromServer.length > 0) {
            return(
                <div>
                    <Row>
                        <h1>Gallery</h1>
                    </Row>
                    <Row className="gallery-container">
                        <Gallery
                            images={this.state.picturesFromServer}
                            enableImageSelection={false}
                            preloadNextImage={false}/>
                    </Row>
                </div>
            );
        }
    };

    render() {

        const place = this.state.place;

        return (
            <div className="place-page">
                <Row className="place-header">
                    <div className="place-title">
                        <h1>{place.name}</h1>
                        <h2>{place.address}</h2>
                    </div>
                    <StarRatings
                        rating={this.state.rating}
                        starRatedColor="#ff8d15"
                        starHoverColor="yellow"
                        starDimension="40px"
                        starSpacing="10px"
                    />
                </Row>


                <div className="container content-container">
                    <ButtonsBlock onBookCompleteHandler={this.onBookCompleteHandler.bind(this)}
                                  addToFavorite={this.addToFavorite.bind(this)}
                                  placeId={place.id}
                                  rating={this.state.rating}
                                  favorite={this.state.favorite}
                                  changeRating={this.changeRating}
                                  isAuthenticated={this.props.isAuthenticated}
                                  latitude={this.state.place.latitude}
                                  longitude={this.state.place.longitude}
                    />
                    <Info openTime={place.open}
                          closeTime={place.close}
                          placeId={this.props.match.params.placeId}
                          freePlaces={place.countFreePlaces}
                          description={place.description}
                          placeImage={this.state.picturesFromServer[0]}
                          countChange={this.countChange}/>
                    {this.renderGallery()}
                    <ReviewsBlock placeId={this.props.match.params.placeId}
                                  currentUser={this.props.currentUser}
                                  isAuthenticated={this.props.isAuthenticated}
                    />
                    {this.viewManagers()}
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        window.dispatchEvent(new CustomEvent(PAGE_CHANGED, {

            detail: {
                show: false,
                name: "place-page"
            }
        }));
    }

    addToFavorite(add) {
        if (add) {
            addFavorite(this.state.place.id).then(response => {
                toast(response.message, 3000);
                this.state['favorite'] = true;
                this.setState({state: this.state});
            }).catch(error => {
                toast(error.message, 3000);
            });
        } else {
            removeFavorite(this.state.place.id).then(response => {
                toast(response.message, 3000);
                this.state['favorite'] = false;
                this.setState({state: this.state});
            }).catch(error => {
                toast(error.message, 3000);
            });
        }
    }

    onBookCompleteHandler(time) {
        const result = checkBookingTime(time, this.state.place);

        if (result.success) {
            bookPlace({
                placeId: this.state.place.id,
                bookingTime: time
            }).then((response) => {
                console.log(response);
                toast(response.message, 3000);
            }).catch(error => toast(error.message, 3000));
            return;
        }

        toast(`You can book this place from ${result.open} to ${result.close}`, 3000);

    }
}

export default withRouter(PlacePage);