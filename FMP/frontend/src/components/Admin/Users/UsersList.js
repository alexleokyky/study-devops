import React, {Component} from 'react';
import {Row, Table} from 'react-materialize';
import {deleteUser} from "../../../util/APIUtils";
import {Session} from "../../../utils";
import User from "./User";
import UsersFilter from "./Filter/UsersFilter";
import './UsersList.css';

class UsersList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            filteredUsers: []
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }


    updateList = () => {
        fetch("/users")
                    .then((response) => response.json())
                    .then((result) => {
                        let users = result.filter((user) => {
                            return user.id != Session.userId();
                        });
                        this.setState({
                            users: users,
                            filteredUsers: users
                        });

                    })
    }

    componentDidMount() {
        this.updateList();
    };

    handleDelete(id) {
        deleteUser(id)
            .then((data) => {
                let users = this.state.filteredUsers.filter((user) => {
                    return id !== user.id;
                });

                this.setState({
                    users: users,
                    filteredUsers: users
                });

                window["Materialize"].toast("User deleted", 3000);
            }).catch((error) => {
            console.error('error', error);
        });
    };

    handleUpdate = (users) => {
        this.setState({
            filteredUsers: users
        });
    };

    render() {
        const users = this.state.filteredUsers;

        return (
            <div className="users-list-wrapper">
                <Row className="title">
                    <h5>Users</h5>
                </Row>
                <Row className="filter">
                    <UsersFilter users={this.state.users}
                                 filteredUsers={this.state.filteredUsers}
                                 handleUpdate = {this.handleUpdate}
                    />
                </Row>
                <Row className="users-list-table">
                    <Table>
                        <thead>
                            <tr>
                                <th data-field="user-name">Name</th>
                                <th data-field="name">Created</th>
                                <th data-field="price">Last Update</th>
                                <th data-field="price">Ban Status</th>
                                <th data-field="price">Email</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                users.map((item) => (
                                        <User  id={item.id}
                                               key={item.id}
                                               userAvatar={item.avatarUrl === null ? "img/admin/user-avatar.png" : item.avatarUrl}
                                               fistName={item.fistName}
                                               lastName={item.lastName}
                                               nickName={item.nickName}
                                               role={item.role.name}
                                               registrationDate={item.registrationDate}
                                               lastUpdateDate={item.lastUpdateDate}
                                               banStatus={item.banStatus}
                                               email={item.email}
                                               update={this.updateList}
                                               handleDelete={this.handleDelete}
                                        />
                                    )
                                )
                            }
                        </tbody>
                    </Table>
                </Row>
            </div>
        );
    }

}

export default UsersList;