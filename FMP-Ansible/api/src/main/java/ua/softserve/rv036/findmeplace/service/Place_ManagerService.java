package ua.softserve.rv036.findmeplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.softserve.rv036.findmeplace.model.Place;
import ua.softserve.rv036.findmeplace.model.Place_Manager;
import ua.softserve.rv036.findmeplace.repository.PlaceRepository;
import ua.softserve.rv036.findmeplace.repository.Place_ManagerRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Place_ManagerService {

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private Place_ManagerRepository placeManagerRepository;

    public List<Place_Manager> getAllPlacesByManagerAndOwner(Long managerId, Long ownerId) {
        List<Long> idPlacesList = placeRepository.findAllByOwnerId(ownerId)
                .stream()
                .map(Place::getId)
                .collect(Collectors.toList());

        return placeManagerRepository.findAllByUserIdAndPlaceIdIn(managerId, idPlacesList);
    }
}
