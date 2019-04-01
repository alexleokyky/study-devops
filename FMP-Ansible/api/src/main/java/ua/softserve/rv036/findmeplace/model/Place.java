package ua.softserve.rv036.findmeplace.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ua.softserve.rv036.findmeplace.model.enums.PlaceType;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Time;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "places")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required field")
    @Size(min = 1, max = 255)
    @Column(name = "name")
    private String name;

    @NotBlank(message = "Address is required field")
    @Size(min = 1, max = 255)
    @Column(name = "address")
    private String address;

    @Column(name = "rating")
    private Double rating;

    @NotBlank(message = "Description is required field")
    @Size(min = 1, max = 255)
    @Column(name = "description")
    private String description;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @NotNull(message = "Time is a required field")
    @Column(name = "open")
    private Time open;

    @NotNull(message = "Time is a required field")
    @Column(name = "close")
    private Time close;

    @Column(name = "count_free_places")
    private int countFreePlaces;

    @Enumerated(EnumType.STRING)
    @Column(name = "place_type")
    private PlaceType placeType;

    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "is_approved")
    private boolean approved;

    @Column(name = "is_rejected")
    private boolean rejected;

    @Column(name = "is_banned")
    private boolean banned;

    public void incrementFreePlaces() {
        countFreePlaces++;
    }

    public void decrementFreePlaces() {
        countFreePlaces--;
    }

}
