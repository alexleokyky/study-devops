package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import ua.softserve.rv036.findmeplace.model.Booking;
import ua.softserve.rv036.findmeplace.model.Place;
import ua.softserve.rv036.findmeplace.model.User;
import ua.softserve.rv036.findmeplace.model.Place_Manager;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends CrudRepository<Booking, Long> {
    @Query("select new Booking(b.id, b.userId, b.placeId, b.bookingTime, b.status, p.name) " +
            "from Booking b, Place p where b.placeId = p.id and b.userId = :userId")
    List<Booking> findAllByUserId(@Param("userId") Long userId);

    @Query("select new Booking(b.id, b.userId, b.placeId, b.bookingTime, b.status, p.name, u.nickName)" +
            "from Booking  b, Place p, User u  where u.id = b.userId and b.placeId = p.id and b.placeId in :placeIds")
    List<Booking> findByPlaceIdIn(@Param("placeIds") List<Long> placeIds);

    @Query("select new Booking (b.id, b.userId, b.placeId, b.bookingTime, b.status, p.name, u.nickName)" +
            "from Booking  b, Place p, User u where  u.id = b.userId and p.id = b.placeId and b.id = :id")
    Optional<Booking> findByIdWithPlaceNameAndUserName(@Param("id") Long id);

    Optional<Booking> findByUserIdAndPlaceId(Long userId, Long placeId);
}
