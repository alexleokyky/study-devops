package ua.softserve.rv036.findmeplace.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "favorite")
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "place_id")
    private Long placeId;

    @Column(name = "user_id")
    private Long userId;

    @Transient
    private transient String placeName;
    @Transient
    private transient String placeDescription;
    @Transient
    private transient int countFreePlaces;
    @Transient
    private transient Double rating;

    public Favorite(Long placeId, Long userId) {
        this.placeId = placeId;
        this.userId = userId;
    }

    public Favorite(Long id, Long placeId, Long userId, String placeName, String placeDescription, int countFreePlaces,
                    Double rating) {
        this.id = id;
        this.placeId = placeId;
        this.userId = userId;
        this.placeName = placeName;
        this.placeDescription = placeDescription;
        this.countFreePlaces = countFreePlaces;
        this.rating = rating;
    }
}
