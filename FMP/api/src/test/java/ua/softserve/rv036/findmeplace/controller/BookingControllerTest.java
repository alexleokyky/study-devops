package ua.softserve.rv036.findmeplace.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import ua.softserve.rv036.findmeplace.model.Booking;
import ua.softserve.rv036.findmeplace.utils.TestUtil;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(MapController.class)
@AutoConfigureMockMvc(secure = false)
public class BookingControllerTest {
    @Autowired
    private MockMvc mvc;

    @MockBean
    BookingController bookingController;

    private Booking booking;

    private List<Booking> bookings;

    @Before
    public void setup(){
        booking = TestUtil.createBooking();
        bookings = Collections.singletonList(booking);
    }

    @Test
    public void getBookings() throws Exception {
        given(bookingController.getBookings()).willReturn(bookings);

        mvc.perform(get("/booking/me")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].placeName", is(booking.getPlaceName())));
    }
}
