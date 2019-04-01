package ua.softserve.rv036.findmeplace.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ua.softserve.rv036.findmeplace.model.Place;
import ua.softserve.rv036.findmeplace.model.User;
import ua.softserve.rv036.findmeplace.model.enums.Role;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAll();

    List<User> findAllByIdIn(List<Long> idList);

    List<User> findAllByRole(Role role);

    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    Optional<User> findByNickName(String nickName);

    Optional<User> findByNickNameOrEmail(String nickName, String email);

    Optional<User> findByActivationCode(String activationCode);

    Boolean existsByNickName(String nickName);

    Boolean existsByEmail(String email);

    Boolean existsByNickNameOrEmail(String nickName, String email);

    List<User> findByNickNameIn(String searchValue);
}