import React, {Component} from 'react';
import {Button, Col, Input, Row} from "react-materialize";
import './UsersFilter.css'

class UsersFilter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            roles: [{"name":"Admin"}, {"name":"User"}, {"name":"Owner"}, {"name":"Manager"}],
            banStatuses: [{"name":"Banned"}, {"name":"Not Banned"}],
            selectedRole: "None",
            selectedBanStatus: "None",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        // TODO
    }

    handleChange(key, value) {
        this.setState({[key]: value});
    }

    handleFilter() {
        let users = this.props.users.filter((user) => {
            if ((this.state.selectedRole === "None") &&
                            (this.state.selectedBanStatus === "None")) {
                return user;
            } else if ((user.role.name === this.state.selectedRole) &&
                            (user.banStatus.name === this.state.selectedBanStatus)) {
                return user;
            } else if ((user.role.name === this.state.selectedRole) &&
                            (this.state.selectedBanStatus === "None")) {
                return user;
            } else if ((this.state.selectedRole === "None") &&
                            (user.banStatus.name === this.state.selectedBanStatus)) {
                return user;
            }
        });

        this.props.handleUpdate(users);
    }

    render() {
        const roles = this.state.roles;
        const banStatuses = this.state.banStatuses;

        return (
            <Row className="filter-wrapper">
                <Col s={3} className="filter-roles">
                    <Input  type='select'
                            label="Role"
                            onChange={e => this.handleChange("selectedRole", e.target.value)}>
                            <option key="None" value="None">None</option>
                                {
                                    roles.map((role) => (
                                        <option key={role.name} value={role.name}>{role.name}</option>
                                    ))
                                }
                    </Input>
                </Col>
                <Col s={3} className="filter-ban-statuses">
                    <Input  type='select'
                            label="Ban status"
                            onChange={e => this.handleChange("selectedBanStatus", e.target.value)}>
                            <option key="None" value="None">None</option>
                                {
                                    banStatuses.map((banStatus) => (
                                        <option key={banStatus.name} value={banStatus.name}>{banStatus.name}</option>
                                    ))
                                }
                    </Input>
                </Col>
                <Button onClick={this.handleFilter}>Filter</Button>
            </Row>
        );
    }

}

export default UsersFilter;