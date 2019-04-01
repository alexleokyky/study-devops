import React, {Component} from "react";
import {Tab, Tabs} from "react-materialize";
import EditPlace from "./EditPlace";
import EditImages from "./EditImages";

class EditPlacePage extends Component {

    render() {

        return(
            <div className="form-container">
            <div className="container register-form">
                <Tabs className="">
                    <Tab active title="Edit information about place">
                        <EditPlace placeId={this.props.match.params.placeId}/>
                    </Tab>
                    <Tab title="Edit pictures of place">
                        <EditImages placeId={this.props.match.params.placeId}/>
                    </Tab>
                </Tabs>
            </div>
            </div>
        );
    }
}

export default EditPlacePage