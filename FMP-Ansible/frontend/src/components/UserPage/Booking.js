import React, {Component} from 'react';
import BookingItem from "./BookingItem";

export  default class UserBookings extends Component {
    render() {
        return (
            <div>
                {
                    this.props.bookings.map(booking =>
                        <BookingItem
                            isManager={false} booking={booking}
                            approveBooking={this.props.approveBooking}
                            rejectBooking={this.props.rejectBooking}
                            cancelBooking={this.props.cancelBooking}
                        />)
                }
            </div>
        );
    }


}