package ua.softserve.rv036.findmeplace.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ua.softserve.rv036.findmeplace.exception.BadRequestException;
import ua.softserve.rv036.findmeplace.model.Mark;
import ua.softserve.rv036.findmeplace.model.Place;
import ua.softserve.rv036.findmeplace.payload.MarkRequest;
import ua.softserve.rv036.findmeplace.repository.MarkRepository;
import ua.softserve.rv036.findmeplace.repository.PlaceRepository;

import java.util.List;
import java.util.OptionalDouble;

@Service
public class MarkService {

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private PlaceRepository placeRepository;

    public void saveMark(MarkRequest request) {

        Mark mark = markRepository.findByUserIdAndPlaceId(request.getUserId(), request.getPlaceId()).
                orElse(new Mark(request.getUserId(), request.getPlaceId()));
        mark.setMark(request.getMark());
        markRepository.save(mark);

        List<Mark> markList = markRepository.findAllByPlaceId(request.getPlaceId());
        double avarageMark = getAvarageMark(markList);
        Place place = placeRepository.findById(request.getPlaceId())
                .orElseThrow(() ->new BadRequestException("No pace with such id"));
        place.setRating(avarageMark);
        placeRepository.save(place);


    }

    public double getAvarageMark(List<Mark> markList) {

        OptionalDouble average = markList
                .stream()
                .mapToDouble(Mark::getMark)
                .average();

        return average.orElse(0);
    }
}
