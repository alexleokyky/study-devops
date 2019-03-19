import React, {Component} from 'react';
import '../styles/BanPage.css'
import {Link} from "react-router-dom";
import {getBanDetails} from "../util/APIUtils";

class BanPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            banReason: "",
        }
    }

    componentDidMount() {
        getBanDetails()
            .then(response => {
                this.setState({
                    banReason: response.banReason,
                })
            })
    }

    render() {
        return(
            <div className="ban-wrapper">
                <div className="ban-container">
                    <div className="title">
                        <h1>You are banned</h1>
                        <h3>Reason: {this.state.banReason}</h3>
                    </div>
                    <Link to="/contact-us">
                        <h2>Contact Admin</h2>
                    </Link>
                </div>
            </div>
        );
    }
}

export default BanPage