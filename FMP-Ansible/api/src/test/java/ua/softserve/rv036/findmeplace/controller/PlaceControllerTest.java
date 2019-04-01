package ua.softserve.rv036.findmeplace.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import ua.softserve.rv036.findmeplace.model.Place_Manager;
import ua.softserve.rv036.findmeplace.utils.TestUtil;

import java.util.Collections;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@AutoConfigureMockMvc(secure = false)
@WebMvcTest(PlaceController.class)
public class PlaceControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private PlaceController placeController;

    private Place_Manager place_manager;

    private List<Place_Manager> place_managerList;

    @Before
    public void setUp() throws Exception {
        place_manager = TestUtil.createPlaceManager();
        place_managerList = Collections.singletonList(place_manager);
    }

    @Test
    public void registerPlace() throws Exception {
        //ObjectMapper objectMapper = new ObjectMapper();
        String placeQuery = "{\"name\":\"Test\"," +
                "\"address\":\"LA\"," +
                "\"open\":\"08:00:00\"," +
                "\"close\":\"18:00:00\"," +
                "\"placeType\":\"CAFE\"," +
                "\"description\":\"errtert\"," +
                "\"longitude\":26.2493254," +
                "\"latitude\":50.6219427," +
                "\"ownerId\":\"3\"}";

        mvc.perform(post("/places/register")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(placeQuery))
                .andExpect(status().isOk());
    }

    @Test
    public void managersByPlaceId() throws Exception {

        given(placeController.managersByPlaceId(place_manager.getPlaceId())).willReturn(place_managerList);

        mvc.perform(get("/places/{id}/managers", 1L)
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void setCountFreePlacesTest() throws Exception {
        mvc.perform(post("/places/{id}/free-places/{count}", 1L, 1))
                .andExpect(status().isOk());
    }


    @Test
    public void updatePlace() throws Exception {
        String placeQuery = "{\"name\":\"NewName\"," +
                "\"open\":\"08:00:00\"," +
                "\"close\":\"18:00:00\"," +
                "\"placeType\":\"CAFE\"," +
                "\"description\":\"NewDescription\"}";

        mvc.perform(post("/places/edit")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(placeQuery))
                .andExpect(status().isOk());
    }
}