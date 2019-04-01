package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.softserve.rv036.findmeplace.model.PlaceImage;

import java.util.List;
import java.util.Optional;

public interface PlaceImageRepository extends JpaRepository<PlaceImage, Long> {
    List<PlaceImage> findAllByPlaceId(Long placeId);

    Optional<PlaceImage> findByImageUrl(String imageUrl);
}
