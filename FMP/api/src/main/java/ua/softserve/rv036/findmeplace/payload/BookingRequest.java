package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;

@Data
public class BookingRequest {
    private String bookingTime;
    private Long placeId;
}
