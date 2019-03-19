package ua.softserve.rv036.findmeplace.utils;

import org.springframework.http.MediaType;
import ua.softserve.rv036.findmeplace.model.Booking;
import ua.softserve.rv036.findmeplace.model.Place;
import ua.softserve.rv036.findmeplace.model.Place_Manager;
import ua.softserve.rv036.findmeplace.model.enums.PlaceType;

import java.nio.charset.Charset;
import java.sql.Time;
import java.time.LocalTime;

public class TestUtil {
    public static final MediaType APPLICATION_JSON_UTF8 = new MediaType(MediaType.APPLICATION_JSON.getType()
            , MediaType.APPLICATION_JSON.getSubtype()
            , Charset.forName("utf8"));

    public static Place createPlace() {
        Place place = new Place();
        place.setName("Starbucks");
        place.setAddress("LA");
        place.setRating(5.0);
        place.setDescription("Best Coffee");
        place.setLatitude(25.111);
        place.setLongitude(55.666);
        place.setOpen(Time.valueOf(LocalTime.MIN));
        place.setClose(Time.valueOf(LocalTime.MAX));
        place.setPlaceType(PlaceType.CAFE);
        place.setOwnerId((long) 1);

        return place;
    }

    public static Place_Manager createPlaceManager() {
        Place_Manager place_manager = new Place_Manager(1L, 1L);
        return place_manager;
    }

    public static Booking createBooking() {
        return new Booking(1L, 1L, 1L, "10:00", 1, "Челентано");
    }
}
