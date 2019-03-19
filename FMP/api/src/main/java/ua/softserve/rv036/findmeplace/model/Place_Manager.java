package ua.softserve.rv036.findmeplace.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@Table(name = "places_managers")
public class Place_Manager {

    public Place_Manager(Long userId, Long placeId) {
        this.userId = userId;
        this.placeId = placeId;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    private String userNickName;

    private String userEmail;

    @Column(name = "place_id")
    private Long placeId;

    private String placeName;

}
