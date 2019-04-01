import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import Home from "./Home/Home.js";
import PlacePage from "./PlacePage/index.js";
import RegistrationForm from "./authorization/RegistrationForm";
import LoginForm from "./authorization/LoginForm";
import ForgotPasswordForm from "./authorization/ForgotPasswordForm";
import RestorePasswordForm from "./authorization/RestorePasswordForm";
import MapForm from "./Map/MapForm";
import UserPage from "./UserPage/UserPage";
import RegisterPlace from "./RegisterPlace/RegisterPlace";
import AppInfo from "./Home/AppInfo";
import UserPlaces from "./User/UserPlaces/UserPlaces";
import UserManagers from "./User/UserManagers/UserManagers";
import {Session} from "../utils";
import AdminPage from "./Admin/AdminPage";
import ManagerPage from "./Manager/ManagerPage";

import NotFound from "../common/NotFound.js";

import PrivateRoute from '../common/PrivateRoute';
import LoadingIndicator from "../common/LoadingIndicator";
import EditPlacePage from "./EditPlace/EditPlacePage";
import ContactUs from "./ContactUs/ContactUs";
import BanPage from "./BanPage";

export default class Routes extends Component {

    renderRedirect = () => {
        if(this.props.currentUser) {
            if(this.props.currentUser.banStatus === "BAN") {
                return(
                    <Redirect to='/ban'/>
                );
            }
        }
    };

    render() {
        const userId = Session.userId();
        const style = {
            minHeight: this.props.minHeight
        };

        return (
            <div id="router" style={style}>
                <Switch>
                    <Route path="/ban" component={BanPage}/>
                    <Route path="/contact-us"
                           render={(props) => <ContactUs
                               isAuthenticated={this.props.isAuthenticated}
                               currentUser={this.props.currentUser}
                           />}/>
                    {this.renderRedirect()}
                    <Route path="//" component={Home}/>
                    <Route path="/app-info" component={AppInfo}/>
                    <Route path="/sign-up" component={RegistrationForm}/>
                    {/*<Route path="/place/:placeId" component={PlacePage}/>*/}
                    <Route path={`/user/${userId}/places`} component={UserPlaces}/>
                    <Route path="/user/profile"
                           render={(routeProps) => <UserPage
                               userId={userId}
                               handleAvatarUpdated={this.props.handleAvatarUpdated}
                               {...routeProps}/>}/>
                    <Route path="/user/:id/places" component={UserPlaces}/>
                    <Route path="/register-place" component={RegisterPlace}/>
                    <Route path="/forgot-password" component={ForgotPasswordForm}/>
                    <Route path="/restore/:token(\b.{8}-.{4}-.{4}-.{4}-.{12}\b)" component={RestorePasswordForm}/>
                    <Route path="/admin-page" render={(props) =>
                        <AdminPage handleAvatarUpdated={this.props.handleAvatarUpdated} {...props}/>}
                    />

                    <Route path="/map" component={MapForm}/>
                    <Route path="/sign-in"
                           render={(props) => <LoginForm onLogin={this.props.handleLogin}
                                                         handleAvatarUpdated={this.props.handleAvatarUpdated}
                                                         {...props} />}/>

                    <Route path={`/user/${userId}/places`} component={UserPlaces}/>
                    <Route path={`/user/${userId}/managers`} component={UserManagers}/>
                    <Route path={`/manager-page`} render={(props) =>
                        <ManagerPage userId={userId} handleAvatarUpdated={this.props.handleAvatarUpdated} {...props} />}/>
                    <Route path="/place/:placeId"
                           render={(props) => <PlacePage
                               handleLogout={this.props.handleLogout}
                               currentUser={this.props.currentUser}
                               isAuthenticated={this.props.isAuthenticated}
                               {...props} />}/>
                    <Route path="/edit-place/:placeId" component={EditPlacePage}/>
                    {/*<Route path="/users/:username"*/}
                    {/*render={(props) => <Profile isAuthenticated={this.props.isAuthenticated}*/}
                    {/*currentUser={this.props.currentUser} {...props}  />}>*/}
                    {/*</Route>*/}

                    <Route path="*" component={NotFound}/>
                </Switch>

            </div>
        );
    }

}