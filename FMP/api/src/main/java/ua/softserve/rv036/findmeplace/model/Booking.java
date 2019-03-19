package ua.softserve.rv036.findmeplace.model;

import lombok.Data;
import ua.softserve.rv036.findmeplace.model.enums.BookingStatus;

import javax.persistence.*;

@Data
@Entity
@Table(name = "booking")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "place_id")
    private Long placeId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "booking_time")
    private String bookingTime;

    @Column(name = "status")
    private int status;

    private String placeName;

    private String userName;

    public Booking(Long userId, Long placeId, String bookingTime) {
        this.userId = userId;
        this.placeId = placeId;
        this.bookingTime = bookingTime;
        this.status = 0;
    }

    public Booking(Long id, Long userId, Long placeId, String bookingTime, int status, String placeName) {
        this.id = id;
        this.userId = userId;
        this.placeId = placeId;
        this.bookingTime = bookingTime;
        this.status = status;
        this.placeName = placeName;
    }

    public Booking(Long id, Long userId, Long placeId, String bookingTime, int status, String placeName, String userName) {
        this.id = id;
        this.userId = userId;
        this.placeId = placeId;
        this.bookingTime = bookingTime;
        this.status = status;
        this.placeName = placeName;
        this.userName = userName;
    }

    public boolean isClosed() {
        return this.status == 2;
    }
}
