package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.softserve.rv036.findmeplace.model.PlaceReject;

import java.util.Optional;

public interface PlaceRejectRepository extends JpaRepository<PlaceReject, Long> {

    //Get last reject for place
    //Optional<PlaceReject> findFirstByOrderByPlaceIdDesc(Long id);
}
