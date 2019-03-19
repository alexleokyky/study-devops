package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ua.softserve.rv036.findmeplace.model.UserBan;

import java.util.List;
import java.util.Optional;

public interface UserBanRepository extends JpaRepository<UserBan, Long> {
    List<UserBan> findAllByUserId(Long id);
    Optional<UserBan> findFirstByUserIdOrderByIdDesc(Long id);
}
