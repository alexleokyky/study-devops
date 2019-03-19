import React, { Component } from 'react';
import {Link, withRouter} from "react-router-dom";
import {Row} from "react-materialize";
import './Home.css';

class Home extends Component {

    render() {
         return (
             <div className="container-fluid">
                 <Row className="greeting">
                     <p>Speed up the search and booking of places with our service</p>
                     <Link to={`app-info`} id="learn-more">Learn more</Link>
                 </Row>
             </div>
        );
    }

}

export default withRouter(Home);