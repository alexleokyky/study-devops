package ua.softserve.rv036.findmeplace.utils;

import lombok.Data;
import ua.softserve.rv036.findmeplace.model.enums.PlaceType;

import java.util.ArrayList;
import java.util.List;

@Data
public class PlaceTypeObject {
    private Boolean hotel;

    private Boolean parking;

    private Boolean restaurant;

    public List<PlaceType> getCurrnetPlaceTypes() {
        List<PlaceType> result = new ArrayList<>();
        if (restaurant) {
            result.add(PlaceType.RESTAURANT);
            result.add(PlaceType.CAFE);
            result.add(PlaceType.PUB);
        }
        if (parking) {
            result.add(PlaceType.PARKING);
        }
        if (hotel) {
            result.add(PlaceType.HOTEL);
        }
        return result;
    }
}
