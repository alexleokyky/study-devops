import React, { Component } from 'react';
import { Row } from "react-materialize";
import './Home.css';

class AppInfo extends Component {

    render() {
        return (
            <div className="container-fluid">
                <Row className="app-info">
                    <h4>What is "Find Me Place"?</h4>
                    <p>
                        "Find Me Place" is a service for quick search and booking of places for rest.
                        We work with a large base of checked institutions and provide accurate
                        information about the availability of available places for booking.
                    </p>
                </Row>
            </div>
        );
    }

}

export default AppInfo;