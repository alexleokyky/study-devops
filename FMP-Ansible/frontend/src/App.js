import React, {Component} from 'react';
import {HashRouter, withRouter} from 'react-router-dom';
//import './App.css';
import Menu from './components/Menu.js';
import Footer from './components/Footer';
import {getAvatar, getCurrentUser} from "./util/APIUtils";
import {Session} from "./utils";
import {ACCESS_TOKEN} from "./constants";
import LoadingIndicator from "./common/LoadingIndicator";
import Routes from "./components/Routes";

class App extends Component {
    constructor(props) {
        super(props);

        this.app = React.createRef();
        this.state = {
            routerHeight: 0,
            userAvatar: "img/avatar.png",
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleAvatarUpdated = this.handleAvatarUpdated.bind(this);
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }
        const style = {
            minHeight: this.state.routerHeight
        };
        return (
            <HashRouter>

                <div ref={this.app} className="app">


                    <Menu
                        currentUser={this.state.currentUser}
                        isAuthenticated={this.state.isAuthenticated}
                        handleLogout={this.handleLogout}
                        userAvatar={this.state.userAvatar}
                    />
                    <Routes
                        isAuthenticated={this.state.isAuthenticated}
                        handleLogout={this.handleLogout}
                        handleLogin={this.handleLogin}
                        minHeight={this.state.routerHeight}
                        currentUser={this.state.currentUser}
                        handleAvatarUpdated={this.handleAvatarUpdated}/>
                    <Footer/>

                </div>
            </HashRouter>
        );
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
    }

    handleLogout(redirectTo = "#/", description = "You're successfully logged out.") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false,
            userAvatar: "img/avatar.png",
        });

        this.props.history.push(redirectTo);
        window.Materialize.toast(description, 1000);

    }

    handleLogin() {
        this.loadCurrentUser();
        window.Materialize.toast('You\'re successfully logged in.', 1000);
    }


    handleAvatarUpdated() {
            getAvatar()
                .then(response => {
                    if (response) {
                        this.setState({
                            userAvatar: response
                        });
                    }
                });
    }

    componentDidMount() {
        this.loadCurrentUser();
        this.resize();
        this.handleAvatarUpdated();
        window.addEventListener('resize', this.onResizeHandler.bind(this));

    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.onResizeHandler.bind(this));
    }

    resize() {
        const node = this.app.current;
        const children = node.children;

        let route, height = 0;
        Array.from(children).forEach((el, i) => {
            if (el.id == "router") {
                route = el;
            } else {
                height += el.clientHeight;
            }
        });

        const newRouterHeight = window.innerHeight - height;

        this.setState({
            routerHeight: newRouterHeight
        });
    }

    onResizeHandler() {
        this.resize();
    }
}

export default withRouter(App);
