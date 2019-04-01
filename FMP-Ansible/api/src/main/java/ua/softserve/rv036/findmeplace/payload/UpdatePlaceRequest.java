package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;
import ua.softserve.rv036.findmeplace.model.enums.PlaceType;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Time;

@Data
public class UpdatePlaceRequest {

    private Long id;

    @NotBlank(message = "Name is required field")
    @Size(min = 1, max = 255)
    @Column(name = "name")
    private String name;

    @NotNull(message = "Time is a required field")
    @Column(name = "open")
    private Time open;

    @NotNull(message = "Time is a required field")
    @Column(name = "close")
    private Time close;

    @Enumerated(EnumType.STRING)
    @Column(name = "place_type")
    private PlaceType placeType;

    @NotBlank(message = "Description is required field")
    @Size(min = 1, max = 255)
    @Column(name = "description")
    private String description;
}
