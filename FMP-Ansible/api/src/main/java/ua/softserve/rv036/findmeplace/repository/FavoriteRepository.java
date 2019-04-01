package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ua.softserve.rv036.findmeplace.model.Favorite;

import java.util.List;

public interface FavoriteRepository extends CrudRepository<Favorite, Long> {
    List<Favorite> findAllByUserId(Long userId);

    @Query("SELECT new Favorite(f.id, f.userId, f.placeId, p.name, p.description, p.countFreePlaces, p.rating) FROM Favorite f, Place p WHERE f.placeId = p.id and f.userId = :userId")
    List<Favorite> findAllWithPlaceByUserId(@Param("userId") Long userId);

    boolean existsByPlaceIdAndUserId(Long placeId, Long userId);

    Favorite findByPlaceIdAndUserId(Long placeId, Long userId);
}