import Autosuggest from 'react-autosuggest';
import {Button, Col, Row, Icon} from 'react-materialize';
import React, {Component} from 'react';
import '../../styles/searchStyle.css'
import {searchUser} from "../../util/APIUtils";

export default class SearchUsers extends Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            users: []
        };
    }

    // componentDidMount() {
    //     fetch("/users")
    //         .then(response => response.json())
    //         .then(
    //             result => {
    //                 this.setState({users: result});
    //                 console.log("state", this.state.users)
    //             })
    // }

    // getSuggestions = value => {
    //     const inputValue = value.trim().toLowerCase();
    //     const inputLength = inputValue.length;
    //
    //     return inputLength === 0 ? [] : this.state.users.filter(user =>
    //         user.nickName.toLowerCase().slice(0, inputLength) === inputValue
    //     );
    // };

    getSuggestionValue = suggestion => suggestion.nickName;

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    renderSuggestion = suggestion => (
        <div>
            {suggestion.nickName}
        </div>
    );

    onSuggestionsFetchRequested = ({value}) => {
        const data = {
            searchValue: value,
        };

        searchUser(data)
            .then(res => {
                this.setState({
                    suggestions: res
                })
            });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const {value, suggestions} = this.state;

        console.log(this.state.value);

        const inputProps = {
            placeholder: 'Type a User nickName...',
            value,
            onChange: this.onChange
        };

        return (
            <Row>
                <Col s={10} className="check-row-search" id="place-page">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                    />
                </Col>
                <Col s={2}>
                    <Button className="black" waves='light' onClick={() => {
                        this.props.updateData(this.state.value)
                    }}><Icon>check</Icon></Button>
                </Col>
            </Row>
        );
    }
}