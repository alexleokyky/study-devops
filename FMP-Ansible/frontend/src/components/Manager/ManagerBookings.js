import React, {Component} from 'react';
import BookingItem from "../UserPage/BookingItem";

export  default class ManagerBookings extends Component {
    render() {
        return (
            <div>
                {
                    this.props.bookings.map(booking =>
                        <BookingItem
                            isManager={true} booking={booking}
                            approveBooking={this.props.approveBooking}
                            rejectBooking={this.props.rejectBooking}
                        />)
                }
            </div>
        );
    }


}