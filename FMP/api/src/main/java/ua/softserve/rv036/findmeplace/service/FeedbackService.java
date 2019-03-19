package ua.softserve.rv036.findmeplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import ua.softserve.rv036.findmeplace.exception.BadRequestException;
import ua.softserve.rv036.findmeplace.model.Feedback;
import ua.softserve.rv036.findmeplace.payload.CommentRequest;
import ua.softserve.rv036.findmeplace.repository.FeedbackRepository;
import ua.softserve.rv036.findmeplace.repository.UserRepository;

import javax.validation.Valid;
import java.util.Date;

@Service
public class FeedbackService {

    @Autowired
    FeedbackRepository feedbackRepository;

    @Autowired
    UserRepository userRepository;

    public boolean saveFeedback(@Valid @RequestBody CommentRequest request){

        String name = userRepository.findById(request.getUserId()).
                orElseThrow(()-> new BadRequestException("No user with such id")).
                getNickName();

        Feedback feedback = new Feedback(
                request.getComment(), new Date(), request.getUserId(),  request.getPlaceId());
        feedbackRepository.save(feedback);
        return true;

    }
}
