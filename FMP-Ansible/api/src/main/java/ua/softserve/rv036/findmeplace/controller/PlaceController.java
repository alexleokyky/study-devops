package ua.softserve.rv036.findmeplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ua.softserve.rv036.findmeplace.model.*;
import ua.softserve.rv036.findmeplace.model.enums.PlaceType;
import ua.softserve.rv036.findmeplace.model.enums.Role;
import ua.softserve.rv036.findmeplace.payload.ApiResponse;
import ua.softserve.rv036.findmeplace.payload.BanPlace;
import ua.softserve.rv036.findmeplace.payload.UpdatePlaceRequest;
import ua.softserve.rv036.findmeplace.repository.*;
import ua.softserve.rv036.findmeplace.security.UserPrincipal;
import ua.softserve.rv036.findmeplace.service.FileStorageService;
import ua.softserve.rv036.findmeplace.service.UserService;

import javax.annotation.security.RolesAllowed;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
public class PlaceController {

    @Autowired
    private PlaceRepository placeRepository;
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlaceRejectRepository placeRejectRepository;

    @Autowired
    private Place_ManagerRepository placeManagerRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PlaceImageRepository placeImageRepository;
    @Autowired
    private UserService userService;

    @GetMapping("place/map")
    List<Place> getPlace() {
        return placeRepository.findAll();
    }

    @GetMapping("/placeByType")
    List<Place> placesByType() {
        return placeRepository.findByPlaceType(PlaceType.CAFE);
    }

    @GetMapping("/places/{id}")
    Optional<Place> getPlaceById(@PathVariable Long id) {
        return placeRepository.findById(id);
    }

    @GetMapping("/places/{id}/managers")
    List<Place_Manager> managersByPlaceId(@PathVariable("id") Long id) {
        return placeManagerRepository.findAllByPlaceId(id);
    }

    @PostMapping("/places/delete-manager/{id}")
    ResponseEntity deletePlaceManagerById(@PathVariable Long id) {
        Long idPlace = placeManagerRepository.findById(id).get().getPlaceId();
        placeManagerRepository.deleteById(id);
        return new ResponseEntity(placeManagerRepository.findAllByPlaceId(idPlace), HttpStatus.OK);
    }

    @PostMapping("/places/{id}/free-places/{count}")
    ResponseEntity setCountFreePlaces(@PathVariable("id") Long id, @PathVariable("count") Integer count) {
       Place place = placeRepository.findById(id).orElseThrow(
                () -> new UsernameNotFoundException("Place not found"));

       int countFreePlaces = place.getCountFreePlaces();

       place.setCountFreePlaces(countFreePlaces + count);

       placeRepository.save(place);

       return new ResponseEntity(placeRepository.findById(id), HttpStatus.OK);
    }

    @PostMapping("/places/{placeId}/delete-manager/{managerId}")
    ResponseEntity deletePlaceManagerByPlace(@PathVariable Long placeId, @PathVariable Long managerId) {

        Optional<Place_Manager> allByUserId = placeManagerRepository.findByUserIdAndPlaceId(managerId, placeId);
        System.out.println(allByUserId.toString());
        placeManagerRepository.delete(allByUserId.get());
        return new ResponseEntity(placeManagerRepository.findAllByUserId(managerId), HttpStatus.OK);
    }

    @GetMapping("/places/{placeId}/access-user/{userId}")
    ResponseEntity getAccessToSetCountFreePlaces(@PathVariable Long placeId, @PathVariable Long userId){
        Boolean accessOwner = placeRepository.existsByIdAndOwnerId(placeId, userId);
        Boolean accessManager = placeManagerRepository.existsByUserIdAndPlaceId(userId, placeId);

        return new ResponseEntity((accessManager || accessOwner), HttpStatus.OK);
    }

    @PostMapping("/places/{id}/add-manager/{value}")
    ResponseEntity addPlaceManager(@Valid @PathVariable Long id, @Valid @PathVariable String value) {
        try {
            User user = userRepository.findByNickName(value)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            Long idUser = user.getId();
            if (placeManagerRepository.existsByUserIdAndPlaceId(idUser, id)) {
                return new ResponseEntity(new ApiResponse(false, "This manager already add to this place"),
                        HttpStatus.BAD_REQUEST);
            } else {
                Place_Manager result = placeManagerRepository.save(new Place_Manager(idUser, id));
                user.setRole(Role.ROLE_MANAGER);
                return new ResponseEntity(placeManagerRepository.findAllByPlaceId(id), HttpStatus.CREATED);
            }
        }catch (UsernameNotFoundException e){
            return new ResponseEntity(new ApiResponse(false, e.getMessage()),
                    HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/places/types")
    List<PlaceType> getAllTypes() {
        return Arrays.asList(PlaceType.values());
    }

    @GetMapping("/places/not-approved")
    @RolesAllowed("ROLE_ADMIN")
    List<Place> getNotApprovedPlaces() {
        return placeRepository.findAllNotApproved();
    }

    @GetMapping("/places/not-approved/{id}")
    @RolesAllowed("ROLE_ADMIN")
    Optional<Place> getNotApprovedPlaceById(@PathVariable Long id) {
        return placeRepository.findNotApprovedById(id);
    }

    @GetMapping("/places/my-places")
    @PreAuthorize("hasAuthority('NOT_BAN')")
    @RolesAllowed("ROLE_OWNER")
    List<Place> getAllMyPlaces() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return placeRepository.findAllAndRejectedByOwnerId(userPrincipal.getId());
    }

    @PostMapping("/places/register")
    @PreAuthorize("hasAuthority('NOT_BAN')")
    @RolesAllowed({"ROLE_OWNER", "ROLE_USER"})
    ResponseEntity registerPlace(@Valid @RequestBody Place place) {

        if(placeRepository.existsByName(place.getName())) {
            return new ResponseEntity(new ApiResponse(Boolean.FALSE, "Place is already exist"),
                    HttpStatus.BAD_REQUEST);
        } else {
            UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            User user = userRepository.findById(userPrincipal.getId()).get();
            if(user.getRole() == Role.ROLE_USER) {
                user.setRole(Role.ROLE_OWNER);
                userRepository.save(user);
            }

            place.setCountFreePlaces(0);
            place.setRating(0.0);
            place.setOwnerId(userPrincipal.getId());
            place.setApproved(false);
            place.setRejected(false);
            Place result = placeRepository.save(place);

            return new ResponseEntity(result, HttpStatus.CREATED);
        }
    }

    @PostMapping("/places/ban")
    @RolesAllowed("ROLE_ADMIN")
    ResponseEntity banPlace(@RequestBody BanPlace banPlace) {
        final Place place = placeRepository.findById(banPlace.getPlaceId()).orElse(null);

        if(place == null) {
            return ResponseEntity.ok().body(new ApiResponse(false, "Place doesn't exist"));
        }

        if (place.isBanned()) {
            return ResponseEntity.ok().body(new ApiResponse(false, "Place has already banned"));
        }

        final Long ownerId = place.getOwnerId();
        final User owner = userRepository.findById(ownerId).orElse(null);

        if (owner != null)
        {
            try {
                userService.sendBanMessage(owner, place.getName(), banPlace.getMessage());
            }
            catch (IOException e) {
                e.printStackTrace();
            }
        }

        place.setBanned(true);
        placeRepository.save(place);

        return ResponseEntity.ok().body(new ApiResponse(true, "Place was banned successfully"));
    }

    @PostMapping("/places/{id}/unban")
    @RolesAllowed("ROLE_ADMIN")
    ResponseEntity unbanPlace(@PathVariable Long id) {
        Place place = placeRepository.findById(id).orElse(null);

        if(place == null) {
            return ResponseEntity.ok().body(new ApiResponse(false, "Place doesn't exist"));
        }

        if (!place.isBanned()) {
            return ResponseEntity.ok().body(new ApiResponse(false, "Place isn't banned"));
        }

        final Long ownerId = place.getOwnerId();
        final User owner = userRepository.findById(ownerId).orElse(null);

        if (owner != null)
        {
            try {
                userService.sendUnbanMessage(owner, place.getName());
            }
            catch (IOException e) {
                e.printStackTrace();
            }
        }

        place.setBanned(false);
        placeRepository.save(place);

        return ResponseEntity.ok().body(new ApiResponse(true, "Place was unbanned successfully"));
    }

    @PostMapping("/places/edit")
    @PreAuthorize("hasAuthority('NOT_BAN')")
    @RolesAllowed("ROLE_OWNER")
    ResponseEntity updatePlace(@Valid @RequestBody UpdatePlaceRequest updatePlaceRequest) {
        Optional<Place> optionalPlace = placeRepository.findById(updatePlaceRequest.getId());

        if(!optionalPlace.isPresent()) {
            ApiResponse response = new ApiResponse(false,
                    "Place with id doesn't exist!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        Place place = optionalPlace.get();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!userPrincipal.getId().equals(place.getOwnerId())) {
            return new ResponseEntity<>(new ApiResponse(false, "Access denied"), HttpStatus.FORBIDDEN);
        }

        place.setName(updatePlaceRequest.getName());
        place.setOpen(updatePlaceRequest.getOpen());
        place.setClose(updatePlaceRequest.getClose());
        place.setPlaceType(updatePlaceRequest.getPlaceType());
        place.setDescription(updatePlaceRequest.getDescription());

        if(place.isRejected()) {
            place.setRejected(false);
        }

        placeRepository.save(place);

        return new ResponseEntity<>(new ApiResponse(true, "Place successful updated"), HttpStatus.OK);
    }

    @PostMapping("/places/reject")
    @RolesAllowed("ROLE_ADMIN")
    ResponseEntity rejectPlace(@Valid @RequestBody PlaceReject placeReject) {
        Optional<Place> optionalPlace = placeRepository.findById(placeReject.getPlaceId());

        if(!optionalPlace.isPresent()) {
            ApiResponse response = new ApiResponse(false,
                    "Place with id " + placeReject.getPlaceId() + " doesn't exist!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        Place place = optionalPlace.get();

        if(place.isApproved()) {
            ApiResponse response = new ApiResponse(false,
                    "Place with id " + placeReject.getPlaceId() + " already approved!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if(place.isRejected()) {
            ApiResponse response = new ApiResponse(false,
                    "Place with id " + placeReject.getPlaceId() + " already rejected!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        place.setRejected(true);
        placeRepository.save(place);
        placeRejectRepository.save(placeReject);

        return new ResponseEntity<>(new ApiResponse(true, "Place successful rejected"), HttpStatus.OK);
    }

    @PutMapping("/places/approve/{id}")
    @RolesAllowed("ROLE_ADMIN")
    ResponseEntity approvePlace(@PathVariable Long id) {
        Optional<Place> optionalPlace = placeRepository.findById(id);

        if(!optionalPlace.isPresent()) {
            ApiResponse response = new ApiResponse(false,
                    "Place doesn't exist!");
            return new ResponseEntity(response, HttpStatus.BAD_REQUEST);
        }

        Place place = optionalPlace.get();

        if(place.isApproved()) {
            ApiResponse response = new ApiResponse(false,
                    "Place with id " + place.getId() + " already approved!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        place.setRejected(false);
        place.setApproved(true);

        placeRepository.save(place);
        return new ResponseEntity<>(new ApiResponse(true, "Place successful approved"), HttpStatus.OK);
    }

    @PostMapping("/places/upload-images/{placeId}")
    @PreAuthorize("hasAuthority('NOT_BAN')")
    @RolesAllowed({"ROLE_OWNER"})
    public ResponseEntity uploadPlaceImages(@RequestParam("files") MultipartFile[] files, @PathVariable Long placeId) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<Place> optional = placeRepository.findById(placeId);

        if(!optional.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(false, "Place not exist"), HttpStatus.BAD_REQUEST);
        }

        Place place = optional.get();

        if(!place.getOwnerId().equals(userPrincipal.getId())) {
            return new ResponseEntity<>(new ApiResponse(false, "Access denied"), HttpStatus.FORBIDDEN);
        }

        for (MultipartFile file : files) {
            if(FileStorageService.isImage(file)) {
                String link = fileStorageService.storeFile(file, "places/" + place.getId());
                PlaceImage placeImage = new PlaceImage(place.getId(), link);
                placeImageRepository.save(placeImage);
            }
        }

        return new ResponseEntity<>(new ApiResponse(true, "Images successful saved"), HttpStatus.OK);
    }

    @GetMapping("/places/download-images/{placeId}")
    public List<PlaceImage> downloadPlaceImages(@PathVariable Long placeId) {
        return placeImageRepository.findAllByPlaceId(placeId);
    }

    @RolesAllowed("ROLE_OWNER")
    @PreAuthorize("hasAuthority('NOT_BAN')")
    @DeleteMapping("/places/images/**")
    public ResponseEntity deletePlaceImage(HttpServletRequest request) {

        String imageUrl = request.getRequestURI().replace("/places/images/", "");

        Optional<PlaceImage> optionalPlaceImage = placeImageRepository.findByImageUrl(imageUrl);
        if(!optionalPlaceImage.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(false, "Can't find image"), HttpStatus.BAD_REQUEST);
        }
        PlaceImage placeImage = optionalPlaceImage.get();

        Optional<Place> optionalPlace = placeRepository.findById(placeImage.getPlaceId());
        if(!optionalPlace.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(false, "Can't find place"), HttpStatus.BAD_REQUEST);
        }
        Place place = optionalPlace.get();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!userPrincipal.getId().equals(place.getOwnerId())) {
            return new ResponseEntity<>(new ApiResponse(false, "Access denied"), HttpStatus.FORBIDDEN);
        }

        fileStorageService.deleteFile(imageUrl.replace("download/", ""));
        placeImageRepository.deleteById(placeImage.getId());

        return new ResponseEntity<>(new ApiResponse(true, "Image successful deleted"), HttpStatus.OK);
    }

}
