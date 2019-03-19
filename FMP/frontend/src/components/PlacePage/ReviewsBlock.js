import React, {Component} from 'react';
import Review from "./Review";
import {Row} from 'react-materialize';
import './Review.css';
import {deleteUserFeedback, getAvatar} from "../../util/APIUtils";
import NewReview from "./AddNewReview";

class ReviewsBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: this.props.isAuthenticated,
            reviews: [],
            avatarUrl: "",
        };
        this.addNewComment = this.addNewComment.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        fetch("/places/" + this.props.placeId + "/feedbacks")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        reviews: result
                    });

                }
            );

        getAvatar()
            .then(response => {
                if(response) {
                    this.setState({
                        avatarUrl: response
                    })
                } else {
                    this.setState({
                        avatarUrl: './img/avatar.png'
                    })
                }
            })
    }

    addNewComment(reviev) {

        console.log(reviev);
        this.setState(pervState => ({
            reviews: [reviev, ...pervState.reviews]
        }));
    }

    handleDelete(id) {
        deleteUserFeedback(id)
            .then((data) => {
                let reviews = this.state.reviews.filter((review) => {
                    return id !== review.id;
                });

                this.setState({
                    reviews: reviews
                });

                window["Materialize"].toast("Feedback deleted", 3000);
                console.log(reviews);
            }).catch((error) => {
            console.error('error', error);
        });
    };

    render() {
        const reviews = this.state.reviews;

        return (
            <Row className="reviews-container">
                <h1>Reviews</h1>

                <div className={this.state.authenticated ? "" : "hidden"}>
                    <NewReview
                        newComment={this.addNewComment}
                        currentUser={this.props.currentUser}
                        placeId={this.props.placeId}
                        avatarUrl={this.state.avatarUrl}/>
                </div>
                {reviews.map(item => (
                    <Review id={item.id}
                            key={item.id}
                            userId={item.userId}
                            userName={item.userName}
                            comment={item.comment}
                            creationDate={item.creationDate}
                            avatar={item.avatarUrl === null ? "./img/avatar.png" : item.avatarUrl}
                            handleDelete={this.handleDelete}
                            currentUser={this.props.currentUser}
                    />
                ))
                }
            </Row>
        );
    }
}

export default ReviewsBlock;