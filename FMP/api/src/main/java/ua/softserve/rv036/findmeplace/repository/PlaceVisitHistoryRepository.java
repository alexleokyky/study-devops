package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.softserve.rv036.findmeplace.model.PlaceVisitHistory;

import java.util.List;

public interface PlaceVisitHistoryRepository extends JpaRepository<PlaceVisitHistory, Long> {

    List<PlaceVisitHistory> findAllByUserId(Long id);
}
