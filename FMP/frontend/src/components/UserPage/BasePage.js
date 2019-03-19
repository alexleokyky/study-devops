import React, { Component } from 'react';

export default class BasePage extends Component {
    componentDidMount() {
        if (this.refs["root"]) {
            const parent = this.refs['root'].parentNode;
            parent.className += " user-tab-content";
        }
    }
}