import React, { Component } from 'react';
import { Row } from "react-materialize";
import BasePage from "./BasePage";
import FavoriteItem from "./FavoriteItem";

import "../Admin/Places/Places.css";

export default class Favorite extends BasePage {
    render() {
        const favorites = this.props.favorites;

        return (
            <div ref="root">
                <Row className="places-container">
                    {favorites.map((item, i) => <FavoriteItem
                        key={i}
                        id={item.placeId}
                        name={item.placeName}
                        description={item.placeDescription}
                        countFreePlaces={item.countFreePlaces}
                        rating={item.rating}
                        bookPlace={this.props.bookPlace}
                        removeFavorite={this.props.removeFavorite}
                    />)}
                </Row>
            </div>
        );
    }
}