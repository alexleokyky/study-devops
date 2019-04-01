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
import ua.softserve.rv036.findmeplace.model.Place;
import ua.softserve.rv036.findmeplace.utils.PlaceTypeObject;
import ua.softserve.rv036.findmeplace.utils.SearchObject;
import ua.softserve.rv036.findmeplace.utils.TestUtil;

import java.util.Collections;
import java.util.List;

import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@RunWith(SpringRunner.class)
@WebMvcTest(MapController.class)
@AutoConfigureMockMvc(secure = false)
public class MapControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private MapController mapController;

    private Place place;

    private List<Place> places;

    @Before
    public void setup(){
        place = TestUtil.createPlace();
        places = Collections.singletonList(place);
    }

    @Test
    public void getPlace() throws Exception {

        given(mapController.getPlace()).willReturn(places);

        mvc.perform(get("/map")
                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is(place.getName())));
    }

    @Test
    public void filteringPlaces() throws Exception {
        String placeTypeObject = "{\"hotel\":\"true\",\"parking\":\"true\",\"restaurant\":\"true\"}";

        given(mapController.filteringPlaces(any(PlaceTypeObject.class))).willReturn(places);

        mvc.perform(post("/map/filter")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(placeTypeObject))
                .andExpect(status().isOk())
                .andExpect(content().contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is(place.getName())));
    }

    @Test
    public void searchPlaces() throws Exception {
        String searchObject = "{\"searchValue\":\"Starbucks\"}";

        given(mapController.searchPlaces(any(SearchObject.class))).willReturn(places);

        mvc.perform(post("/map/search")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(searchObject))
                .andExpect(status().isOk())
                .andExpect(content().contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is(place.getName())));
    }

    @Test
    public void allPlaces() throws Exception{

        given(mapController.allPlaces()).willReturn(places);

        mvc.perform(post("/map/all")
                .contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is(place.getName())));
    }


}