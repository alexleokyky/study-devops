import React, {Component} from 'react';
import {Col, Row} from "react-materialize";
import ApprovablePlace from "./ApprovablePlace";
import {getApprovePlaces} from "../../util/APIUtils";

class ApprovablePlaces extends Component {

    constructor(props) {
        super(props);
        this.state = {
            places: [],
        };
    }

    componentDidMount() {
        getApprovePlaces()
            .then(response => {
                this.setState({
                    places: response
                })
            })
    }

    handleUpdate = () => {
        this.componentDidMount();
    };

    renderTitle = () => {
        if(this.state.places.length === 0) {
            return(
                <h3>There are no places to approve</h3>
            )
        }
    };

    render() {
        const places = this.state.places;

        return(
            <Row className="user-places-wrapper">
                <Row className="places-container">
                    {this.renderTitle()}
                    {
                        places.map((item) => (
                                <ApprovablePlace placeId={item.id}
                                       key={item.id}
                                       name={item.name}
                                       placeType={item.placeType.name}
                                       description={item.description}
                                       handleUpdate={this.handleUpdate}
                                />
                            )
                        )
                    }
                </Row>
            </Row>
        );
    }

}

export default ApprovablePlaces;
