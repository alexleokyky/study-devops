package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ua.softserve.rv036.findmeplace.model.Feedback;
import ua.softserve.rv036.findmeplace.model.Mark;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {

    @Query("select new ua.softserve.rv036.findmeplace.model.Mark(f.id, f.mark, f.userId, f.placeId)" +
            "from Mark f, User u where f.userId = u.id and f.placeId = :id")
    List<Mark> findAllByPlaceId(@Param("id") Long id);

    Optional<Mark> findByUserIdAndPlaceId(Long userId, Long placeId);
}
