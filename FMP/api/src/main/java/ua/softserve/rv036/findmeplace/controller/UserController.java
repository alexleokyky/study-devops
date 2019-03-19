package ua.softserve.rv036.findmeplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.softserve.rv036.findmeplace.model.*;
import ua.softserve.rv036.findmeplace.model.enums.Role;
import ua.softserve.rv036.findmeplace.payload.*;
import ua.softserve.rv036.findmeplace.repository.*;
import ua.softserve.rv036.findmeplace.security.CurrentUser;
import ua.softserve.rv036.findmeplace.security.UserPrincipal;
import ua.softserve.rv036.findmeplace.service.FileStorageService;
import ua.softserve.rv036.findmeplace.service.MailSender;
import ua.softserve.rv036.findmeplace.service.Place_ManagerService;
import ua.softserve.rv036.findmeplace.service.UserService;
import ua.softserve.rv036.findmeplace.utils.SearchUser;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private Place_ManagerService placeManagerService;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private Place_ManagerRepository placeManagerRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserBanRepository userBanRepository;

    @Autowired
    private PlaceVisitHistoryRepository placeVisitHistoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private MailSender mailSender;

    @GetMapping("/user/me")
    @RolesAllowed({"ROLE_USER", "ROLE_MANAGER", "ROLE_OWNER", "ROLE_ADMIN"})
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getRole(), currentUser.getBanStatus());
        userSummary.setFirstName(currentUser.getFirstName());
        userSummary.setLastName(currentUser.getLastName());
        userSummary.setEmail(currentUser.getEmail());
        userSummary.setPhone(currentUser.getPhone());
        return userSummary;
    }

//    @GetMapping("/user/me")
//    @RolesAllowed({"ROLE_USER", "ROLE_MANAGER", "ROLE_OWNER", "ROLE_ADMIN"})
//    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
//        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getAuthority().getAuthority());
//        return userSummary;
//    }

    @GetMapping("/users")
    List<User> getAll() {
        return userRepository.findAll();
    }

    @PostMapping("/users/search")
    List<User> searchUsers(@RequestBody SearchUser searchUserObj) {
        return userRepository.findByNickNameIn(searchUserObj.getSearchValue());
    }

    @GetMapping("/users/{id}")
    Optional<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
    }

    @GetMapping("/user/{id}/places")
    public List<Place> getUserPlaces(@PathVariable Long id) {
        return placeRepository.findAllByOwnerId(id);
    }

    @GetMapping("/manager/{managerId}/places-by-owner/{ownerId}")
    public List<Place_Manager> getManagerPlaces(@PathVariable("managerId") Long managerId, @PathVariable Long ownerId) {

        return placeManagerService.getAllPlacesByManagerAndOwner(managerId, ownerId);
    }

    @GetMapping("/user/{id}/managers")
    public List<User> getUserManagers(@PathVariable Long id) {
        return userService.getAllManagersByOwnerRole(id);
    }

    @PostMapping("/user/{ownerId}/delete-manager/{managerId}")
    ResponseEntity deleteManagers(@PathVariable Long ownerId, @PathVariable Long managerId){

        List<Place_Manager> allByUserId = placeManagerService.getAllPlacesByManagerAndOwner(managerId, ownerId);

        placeManagerRepository.deleteAll(allByUserId);

        List<User> result = userService.getAllManagersByOwnerRole(ownerId);

        return new ResponseEntity(result, HttpStatus.OK);
    }

    @GetMapping("/users/nick/{nickname}")
    Optional<User> getUserByNickName(@PathVariable String nickname) {
        return userRepository.findByNickName(nickname);
    }

    @PostMapping("/set-avatar")
    @PreAuthorize("hasAuthority('NOT_BAN')")
    @RolesAllowed({"ROLE_USER", "ROLE_OWNER", "ROLE_MANAGER", "ROLE_ADMIN"})
    public ResponseEntity uploadAvatar(@RequestParam("file") MultipartFile file) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> optional = userRepository.findById(userPrincipal.getId());
        User user = optional.get();

        if(FileStorageService.isImage(file)) {
            String link = fileStorageService.storeFile(file, "users/" + user.getId());
            user.setAvatarUrl(link);
            userRepository.save(user);
            return new ResponseEntity<>(new ApiResponse(true, "Avatar changed"), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ApiResponse(false, "Avatar not changed"), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("get-avatar")
    @PreAuthorize("hasAuthority('NOT_BAN')")
    @RolesAllowed({"ROLE_USER", "ROLE_OWNER", "ROLE_MANAGER", "ROLE_ADMIN"})
    public Optional<String> getAvatar() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> optional = userRepository.findById(userPrincipal.getId());
        User user = optional.get();

        return Optional.ofNullable(user.getAvatarUrl());
    }

    @PostMapping("/users/update")
    ResponseEntity updateUser(@Valid @RequestBody UpdateProfileRequest updateProfileRequest) {
        final Long userId = updateProfileRequest.getUserId();

        Optional<User> optional = userRepository.findById(userId);
        User user = optional.get();

        if (user == null) {
            ApiResponse response = new ApiResponse(false, "User by id " + userId + " doesn't exist!");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

        final String password = updateProfileRequest.getPassword();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            ApiResponse response = new ApiResponse(false, "You have entered invalid password");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

        final String firstName = updateProfileRequest.getFirstName();
        final String lastName = updateProfileRequest.getLastName();
        final String nickName = updateProfileRequest.getNickName();
        final String email = updateProfileRequest.getEmail();
        final String phone = updateProfileRequest.getPhone();

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setNickName(nickName);
        user.setEmail(email);
        user.setPhone(phone);

        final String newPassword = updateProfileRequest.getNewPassword();
        final String confirmPassword = updateProfileRequest.getConfirmPassword();

        if (newPassword.length() > 0) {
            if (!password.equals(newPassword)) {
                if (newPassword.equals(confirmPassword)) {
                    user.setPassword(passwordEncoder.encode(newPassword));
                }
            }
        }

        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Your profile was changed successfully"));
    }

    @DeleteMapping("/user/delete-place/{id}")
    public ResponseEntity deleteUserPlaceById(@PathVariable("id") Long id) {
        placeRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/user/delete-feedback/{id}")
    public ResponseEntity deleteUserFeedbackById(@PathVariable("id") Long id) {
        feedbackRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/user/update-profile")
    ResponseEntity updateUserProfile(@RequestBody UpdateProfileRequest updateProfileRequest) {
        return userService.updateUserProfile(updateProfileRequest);
    }

    @PostMapping("/user/update-password")
    ResponseEntity updateUserPassword(@RequestBody UpdateProfileRequest updateProfileRequest) {
       return userService.updateUserPassword(updateProfileRequest);
    }

    @DeleteMapping("/user/delete/{id}")
    public ResponseEntity deleteUser(@PathVariable("id") Long id) {
        userRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/email/to-user")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity emailToUser(@Valid @RequestBody EmailToUserRequest emailToUserRequest) {
        Optional<User> userOptional = userRepository.findById(emailToUserRequest.getUserId());

        if(!userOptional.isPresent()) {
            ApiResponse apiResponse = new ApiResponse(false, "User does not exist");
            return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
        }

        User user = userOptional.get();
        String email = user.getEmail();
        String subject = emailToUserRequest.getSubject();
        String message = emailToUserRequest.getMessage();
        mailSender.send(email, subject, message);

        return new ResponseEntity<>(new ApiResponse(true, "Email has been sent"), HttpStatus.OK);
    }

    @PostMapping("/email/to-admin")
    public ResponseEntity emailToAdmin(@Valid @RequestBody EmailToAdminRequest emailToAdminRequest) {
        String from = emailToAdminRequest.getUserEmail();
        String subject = emailToAdminRequest.getSubject();
        String message = emailToAdminRequest.getMessage();

        List<User> admins = userRepository.findAllByRole(Role.ROLE_ADMIN);

        admins.forEach(admin -> mailSender.sendWithUserEmail(from, admin.getEmail(), subject, message));

        return new ResponseEntity<>(new ApiResponse(true, "Email has been sent"), HttpStatus.OK);
    }

    @PostMapping("/user/ban")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity banUser(@Valid @RequestBody UserBan userBan) {
        return userService.banUser(userBan);
    }

    @PostMapping("/user/unban/{id}")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity unbanUser(@PathVariable("id") Long id) {
        return userService.unbanUser(id);
    }

    @GetMapping("/user/ban/details")
    @PreAuthorize("hasAuthority('BAN')")
    public UserBan getBanDetails(@CurrentUser UserPrincipal userPrincipal) {
        Optional<UserBan> userBanOptional = userBanRepository.findFirstByUserIdOrderByIdDesc(userPrincipal.getId());

        if(!userBanOptional.isPresent()) {
            return null;
        }

        return userBanOptional.get();
    }

    @GetMapping("user/visit-history")
    @RolesAllowed({"ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN", "ROLE_OWNER"})
    public List<PlaceVisitHistory> userHistoryVisit(@CurrentUser UserPrincipal currentUser) {
        long id = currentUser.getId();

        return placeVisitHistoryRepository.findAllByUserId(id);
    }

    @DeleteMapping("user/visit-history/delete/{id}")
    public ResponseEntity deleteVisitHistory(@PathVariable("id") Long id, @CurrentUser UserPrincipal currentUser) {

        Optional<PlaceVisitHistory> historyOptional = placeVisitHistoryRepository.findById(id);

        if(!historyOptional.isPresent()) {
            ApiResponse apiResponse = new ApiResponse(false, "Visit history item not exists");
            return new ResponseEntity<>(apiResponse,  HttpStatus.BAD_REQUEST);
        }

        PlaceVisitHistory historyItem = historyOptional.get();

        if(!historyItem.getUserId().equals(currentUser.getId())) {
            ApiResponse apiResponse = new ApiResponse(false, "Access denied");
            return new ResponseEntity<>(apiResponse,  HttpStatus.BAD_REQUEST);
        }

        placeVisitHistoryRepository.deleteById(id);

        return new ResponseEntity<>(new ApiResponse(true, "Visit history item has been deleted"), HttpStatus.OK);
    }
}
