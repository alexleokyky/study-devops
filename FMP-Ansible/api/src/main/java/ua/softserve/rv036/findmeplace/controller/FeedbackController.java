package ua.softserve.rv036.findmeplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.softserve.rv036.findmeplace.exception.BadRequestException;
import ua.softserve.rv036.findmeplace.model.Feedback;
import ua.softserve.rv036.findmeplace.model.Place;
import ua.softserve.rv036.findmeplace.payload.ApiResponse;
import ua.softserve.rv036.findmeplace.payload.CommentRequest;
import ua.softserve.rv036.findmeplace.payload.MarkRequest;
import ua.softserve.rv036.findmeplace.repository.FeedbackRepository;
import ua.softserve.rv036.findmeplace.repository.PlaceRepository;
import ua.softserve.rv036.findmeplace.service.FeedbackService;
import ua.softserve.rv036.findmeplace.service.MarkService;

import javax.validation.Valid;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@RestController
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private MarkService markService;

    @Autowired
    private PlaceRepository placeRepository;

    @GetMapping("/places/{id}/feedbacks")
    List<Feedback> feedbacksByPlaceId(@PathVariable Long id) {
        List<Feedback> feedbacks = feedbackRepository.findAllByPlaceId(id);
        feedbacks.sort(Comparator.comparing(Feedback::getId).reversed());
        return feedbacks;
    }

    @PostMapping("/places/feedback")
    @Valid
    public ResponseEntity<?> saveFeedback(@RequestBody CommentRequest commentRequest) {
        feedbackService.saveFeedback(commentRequest);
        return ResponseEntity.ok().body(new ApiResponse(true, "Feedback added successfully"));
    }

    @PostMapping("/places/mark")
    @Valid
    public ResponseEntity<?> saveMark(@RequestBody MarkRequest markRequest) {
        markService.saveMark(markRequest);

        Place place = placeRepository.findById(markRequest.getPlaceId())
                .orElseThrow(() -> new BadRequestException("No pace with such id"));
        Double rating = place.getRating();

        return new ResponseEntity<>(rating, HttpStatus.OK);
    }
}
