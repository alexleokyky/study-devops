import React, {Component} from 'react';
import {Button, CardPanel, Col, Row, Icon} from 'react-materialize';
import SearchUsers from "./SearchUsers";
import {addPlaceManager, deletePlaceManager, searchPlace} from "../../util/APIUtils";

class ManagersBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            managers: [],
            viewAddManagers: false,
            searchValue: ''};

        this.viewAddManagers = this.viewAddManagers.bind(this);
    }

    componentDidMount() {
        fetch("/places/" + this.props.placeId + "/managers")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        managers: result
                    });
                }
            )
    }

    handleDelete(id) {
        deletePlaceManager(id)
            .then((result) => {
                this.setState({
                    managers: result
                });
                window["Materialize"].toast("Manager fired", 3000);
            }).catch((error) => {
            console.error('error', error);
        });
    }

    updateData = (value) => {
        const id = this.props.placeId;
        console.log(value, id);

        addPlaceManager(id, value)
            .then(result => {
                console.log(result);
                this.setState({
                    managers: result,
                    viewAddManagers: false
                });
                window["Materialize"].toast("You add manager " + value + "  to this place", 3000);
            }).catch((error) => {
            window["Materialize"].toast(error.message, 3000);
        })
    };

    viewAddManagers() {
            return (
                <Row>
                    <Col s={4} offset="s4">
                        <p>Find user by nickname</p>
                    </Col>
                    <Col s={4}>
                        <SearchUsers updateData={this.updateData}/>
                    </Col>
                </Row>
            )}

    render() {

        const managers = this.state.managers;
        console.log(this.state.viewAddManagers);

        return (
            <Row className="managers-container">
                <h1>Managers</h1>
                <CardPanel className="card-panel-rvw blue lighten-5">
                    {managers.map(item => (
                        <Row className="center" key={item.id}>
                            <Col s={5}>
                                <p>{item.userNickName}</p>
                            </Col>
                            <Col s={5}>
                                <p>{item.userEmail}</p>
                            </Col>
                            <Col s={2}>
                                <Button className="red" waves='light' onClick={() => {
                                    this.handleDelete(item.id);
                                }}>Fire manager</Button>
                            </Col>
                        </Row>
                    ))}
                        {
                            (this.state.viewAddManagers) ? this.viewAddManagers() : ''
                        }
                        <Row>
                            <Col s={1} offset="s11">
                                <Button className="black" title="Add new manager for this place!" waves='light'
                                        onClick={() => {
                                    this.setState({viewAddManagers: true})
                                }}><Icon>person_add</Icon></Button>
                            </Col>
                        </Row>
                </CardPanel>
            </Row>
        );
    }
}

export default ManagersBlock;