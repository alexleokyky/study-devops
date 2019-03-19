package ua.softserve.rv036.findmeplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ua.softserve.rv036.findmeplace.model.Favorite;
import ua.softserve.rv036.findmeplace.payload.ApiResponse;
import ua.softserve.rv036.findmeplace.repository.FavoriteRepository;
import ua.softserve.rv036.findmeplace.security.UserPrincipal;

import java.util.List;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {
    @Autowired
    private FavoriteRepository favoriteRepository;

    @PostMapping("/{placeId}/add")
    public ResponseEntity addFavoritePlace(@PathVariable Long placeId) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        final Long userId = principal.getId();
        final String error = "The place has been already added to favorite list";

        if (favoriteRepository.existsByPlaceIdAndUserId(placeId, userId)) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, error));
        }

        Favorite favorite = new Favorite(placeId, userId);
        favoriteRepository.save(favorite);

        return ResponseEntity.ok().body(new ApiResponse(true, "The place added to favorite successfully"));
    }

    @GetMapping("/get")
    public List<Favorite> getFavorites() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        final Long userId = principal.getId();

        return favoriteRepository.findAllWithPlaceByUserId(userId);
    }

    @GetMapping("/{placeId}/check")
    public boolean checkFavorite(@PathVariable Long placeId) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        final Long userId = principal.getId();
        System.out.println(userId);
        final Favorite favorite = favoriteRepository.findByPlaceIdAndUserId(placeId, userId);

        System.out.println("favorite");
        System.out.println(favorite);

        if (favorite == null) {
            return false;
        }

        return true;
    }

    @DeleteMapping("/{placeId}/remove")
    public ResponseEntity removeFavoritePlace(@PathVariable Long placeId) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        final Long userId = principal.getId();

        if (!favoriteRepository.existsByPlaceIdAndUserId(placeId, userId)) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "This place doesn't exist"));
        }

        Favorite favorite = favoriteRepository.findByPlaceIdAndUserId(placeId, userId);
        favoriteRepository.deleteById(favorite.getId());

        return ResponseEntity.ok().body(new ApiResponse(true, "The place successfully remove from favorite"));
    }
}
