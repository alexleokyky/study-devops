package ua.softserve.rv036.findmeplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ua.softserve.rv036.findmeplace.model.Place;
import ua.softserve.rv036.findmeplace.repository.PlaceRepository;
import ua.softserve.rv036.findmeplace.utils.PlaceTypeObject;
import ua.softserve.rv036.findmeplace.utils.SearchObject;

import java.util.List;

@RestController
public class MapController {

    @Autowired
    private PlaceRepository placeRepository;


    @GetMapping("/map")
    List<Place> getPlace() {
        return placeRepository.findAll();
    }

    @PostMapping("/map/filter")
    List<Place> filteringPlaces(@RequestBody PlaceTypeObject placeTypeObject) {
        return placeRepository.findByPlaceTypeIn(placeTypeObject.getCurrnetPlaceTypes());
    }

    @PostMapping("/map/search")
    List<Place> searchPlaces(@RequestBody SearchObject searchObject) {
        return placeRepository.findByNameIn(searchObject.getSearchValue());
    }

    @PostMapping("/map/all")
    List<Place> allPlaces() {
        return placeRepository.findAll();
    }
}
