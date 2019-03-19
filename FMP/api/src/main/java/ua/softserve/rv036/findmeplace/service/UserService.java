package ua.softserve.rv036.findmeplace.service;

import liquibase.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ua.softserve.rv036.findmeplace.model.*;
import ua.softserve.rv036.findmeplace.model.enums.BanStatus;
import ua.softserve.rv036.findmeplace.model.enums.Role;
import ua.softserve.rv036.findmeplace.payload.ApiResponse;
import ua.softserve.rv036.findmeplace.payload.UpdateProfileRequest;
import ua.softserve.rv036.findmeplace.repository.PlaceRepository;
import ua.softserve.rv036.findmeplace.repository.Place_ManagerRepository;
import ua.softserve.rv036.findmeplace.repository.UserBanRepository;
import ua.softserve.rv036.findmeplace.repository.UserRepository;
import ua.softserve.rv036.findmeplace.security.UserPrincipal;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Value("${basicBackendURL}")
    private String backendURL;

    @Value("${basicFrontendURL}")
    private String frontendURL;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailSender mailSender;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private Place_ManagerRepository placeManagerRepository;

    @Autowired
    private UserBanRepository userBanRepository;


    public boolean createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setBanStatus(BanStatus.NOT_BAN);
        user.setActivationCode(UUID.randomUUID().toString());

        try {
            sendEmailConfirmation(user);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        userRepository.save(user);

        return true;
    }

    public void sendEmailConfirmation(User user) throws IOException {

        if (!StringUtils.isEmpty(user.getEmail())) {
            String URL = backendURL + "auth/activate/" + user.getActivationCode() ;

            String context = new String(Files.readAllBytes(Paths.get("api/src/main/resources/emailConfirmation.html")));

            String message = String.format(
                    context,
                    user.getNickName(), URL);
            mailSender.send(user.getEmail(), "Activate your email!", message);

        }
    }

    public boolean sendRestoreEmail(User user) {

        if (!StringUtils.isEmpty(user.getEmail())) {
            String URL = frontendURL + "restore/" + user.getActivationCode();

            String context = null;
            try {
                context = new String(Files.readAllBytes(Paths.get("api/src/main/resources/passwordRestore.html")));
            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }

            String message = String.format(
                    context, URL);
            mailSender.send(user.getEmail(), "Restore your password!", message);
        }
        return true;
    }


    public void activateUser(User user) {
        user.setActive(true);
        user.setActivationCode(null);
        userRepository.save(user);
    }

    public void restoreUserPassword(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActivationCode(null);
        userRepository.save(user);
    }

    public ResponseEntity updateUserProfile(UpdateProfileRequest updateProfileRequest) {
        Long userId = updateProfileRequest.getUserId();
        Optional<User> optional = userRepository.findById(userId);

        if (!optional.isPresent()) {
            ApiResponse response = new ApiResponse(false, "User by id " + userId + " doesn't exist!");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

        User user = optional.get();
        String firstName = updateProfileRequest.getFirstName();
        String lastName = updateProfileRequest.getLastName();
        String nickName = updateProfileRequest.getNickName();
        String email = updateProfileRequest.getEmail();

        final String password = updateProfileRequest.getPassword();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            ApiResponse response = new ApiResponse(false, "You have entered invalid password");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setNickName(nickName);
        user.setEmail(email);

        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Your profile was changed successfully"));
    }

    public ResponseEntity updateUserPassword(UpdateProfileRequest updateProfileRequest) {
        Long userId = updateProfileRequest.getUserId();
        Optional<User> optional = userRepository.findById(userId);

        if (!optional.isPresent()) {
            ApiResponse response = new ApiResponse(false, "User by id " + userId + " doesn't exist!");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

        User user = optional.get();
        String password = updateProfileRequest.getPassword();
        String newPassword = updateProfileRequest.getNewPassword();
        String confirmPassword = updateProfileRequest.getConfirmPassword();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            ApiResponse response = new ApiResponse(false, "You have entered invalid password");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

        if (password.equals(newPassword)) {
            return ResponseEntity.ok(new ApiResponse(false, "The new password must be different from the old one"));
        }

        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.ok(new ApiResponse(false, "Enter password verification"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Your password was changed successfully"));
    }

    public List<User> getAllManagersByOwnerRole(Long ownerId) {
        List<Long> idPlacesList = placeRepository.findAllByOwnerId(ownerId)
                .stream()
                .map(Place::getId)
                .collect(Collectors.toList());

        List<Long> idUsersList = placeManagerRepository.findAllByPlaceIdIn(idPlacesList)
                .stream()
                .map(Place_Manager::getUserId)
                .collect(Collectors.toList());

        return userRepository.findAllByIdIn(idUsersList);
    }

    public void sendBookingConfirmation(User user, Booking booking) throws IOException {
        if (!StringUtils.isEmpty(user.getEmail())) {
            String message = "Hi, " + booking.getUserName() + "! Your booking on " + booking.getPlaceName()
                    + " was approved!";

            mailSender.send(user.getEmail(), "Approve!", message);
        }
    }

    public void sendBookingReject(User user, Booking booking) throws IOException {
        if (!StringUtils.isEmpty(user.getEmail())) {
            String message = "Hi, " + booking.getUserName() + "! Your booking on " + booking.getPlaceName()
                    + " was rejected!";

            mailSender.send(user.getEmail(), "Reject!", message);
        }
    }

    public void sendNewBooking(User manager, User client, Place place) throws IOException {
        if (!StringUtils.isEmpty(manager.getEmail())) {
            String message = "Hi, " + manager.getFirstName() + " " + manager.getLastName()
                    + "! Your client " + client.getFirstName() + " " + client.getLastName()
                    + " sent new booking on " + place.getName() + "!";

            mailSender.send(manager.getEmail(), "New booking!", message);
        }
    }

    public void sendBanMessage(User owner, String placeName, String banMessage) throws IOException {
        if (!StringUtils.isEmpty(owner.getEmail())) {
            String message = "Hi, " + owner.getFirstName() + " " + owner.getLastName()
                    + "! Your place " + placeName + " was banned because: \n" + banMessage + "!";

            mailSender.send("lewadece@daabox.com"/*owner.getEmail()*/, "Ban!", message);
        }
    }

    public void sendUnbanMessage(User owner, String placeName) throws IOException {
        if (!StringUtils.isEmpty(owner.getEmail())) {
            String message = "Hi, " + owner.getFirstName() + " " + owner.getLastName()
                    + ", congratulations! Your place " + placeName + " was unbanned.";

            mailSender.send("lewadece@daabox.com"/*owner.getEmail()*/, "Good news!", message);
        }
    }

    public ResponseEntity banUser(UserBan userBan) {
        Optional<User> optionalUser = userRepository.findById(userBan.getUserId());
        User user = null;

        if(!optionalUser.isPresent()) {
            ApiResponse response = new ApiResponse(false,
                    "User doesn't exist!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        user = optionalUser.get();

        if(user.getBanStatus() == BanStatus.BAN) {
            ApiResponse response = new ApiResponse(false,
                    "User already banned");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            user.setBanStatus(BanStatus.BAN);
            userRepository.save(user);
        }

        userBanRepository.save(userBan);

        ApiResponse response = new ApiResponse(true, "User successful banned");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity unbanUser(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        User user = null;

        if(!optionalUser.isPresent()) {
            ApiResponse response = new ApiResponse(false,
                    "User doesn't exist!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        user = optionalUser.get();

        if(user.getBanStatus() == BanStatus.NOT_BAN) {
            ApiResponse response = new ApiResponse(false,
                    "User already not banned");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            user.setBanStatus(BanStatus.NOT_BAN);
            userRepository.save(user);
        }

        List<UserBan> userBans = userBanRepository.findAllByUserId(userId);
        userBanRepository.deleteAll(userBans);

        ApiResponse response = new ApiResponse(true, "User successful unbanned");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



}