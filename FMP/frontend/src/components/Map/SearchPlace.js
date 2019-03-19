import Autosuggest from 'react-autosuggest';
import {Button, Col, Row, Icon} from 'react-materialize';
import React, {Component} from 'react';
import '../../styles/searchStyle.css'

export default class SearchPlace extends Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            places: []
        };
    }

    componentDidMount() {
        fetch("/map")
            .then(response => response.json())
            .then(
                result => {
                    this.setState({places: result});
                    console.log("state", this.state.places)
                })
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.places.filter(place =>
            place.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    getSuggestionValue = suggestion => suggestion.name;

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    renderSuggestion = suggestion => (
        <div>
            {suggestion.name}
        </div>
    );

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value)
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
            placeholder: 'Type a Place name...',
            value,
            onChange: this.onChange
        };

        return (
            <Row>
                <Col s={10} className="check-row-search">
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
                    <Button waves='light' onClick={() => {
                        this.props.updateData(this.state.value)
                    }}><Icon>search</Icon></Button>
                </Col>
            </Row>
        );
    }
}