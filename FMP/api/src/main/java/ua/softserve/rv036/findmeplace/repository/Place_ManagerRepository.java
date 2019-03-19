package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ua.softserve.rv036.findmeplace.model.Place_Manager;

import java.util.List;
import java.util.Optional;

@Repository
public interface Place_ManagerRepository extends JpaRepository<Place_Manager, Long> {

    @Query("select new Place_Manager(f.id, f.userId, u.nickName, u.email, f.placeId, p.name) " +
            "from Place_Manager f " +
            "join User u on u.id = f.userId " +
            "join Place p on p.id = f.placeId " +
            "where f.placeId = :id")
    List<Place_Manager> findAllByPlaceId(@Param("id") Long id);

    List<Place_Manager> findAllByPlaceIdIn(List<Long> idList);

    Optional<Place_Manager> findById(Long id);

    @Query("select new Place_Manager(f.id, f.userId, u.nickName, u.email, f.placeId, p.name) " +
            "from Place_Manager f " +
            "join User u on u.id = f.userId " +
            "join Place p on p.id = f.placeId " +
            "where f.userId = :id")
    List<Place_Manager> findAllByUserId(@Param("id") Long id);

    @Query("select new Place_Manager(f.id, f.userId, u.nickName, u.email, f.placeId, p.name) " +
            "from Place_Manager f " +
            "join User u on u.id = f.userId " +
            "join Place p on p.id = f.placeId " +
            "where f.userId = :id and f.placeId in :idList")
    List<Place_Manager> findAllByUserIdAndPlaceIdIn(@Param("id") Long id,@Param("idList") List<Long> idList);

    Optional<Place_Manager> findByUserIdAndPlaceId(Long userId, Long placeId);

    Boolean existsByUserIdAndPlaceId(Long userId, Long placeId);

}
