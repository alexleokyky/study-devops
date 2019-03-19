package ua.softserve.rv036.findmeplace.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@AllArgsConstructor
@Table(name = "place_images")
public class PlaceImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "place_id")
    private Long placeId;

    @Column(name = "image_url")
    private String imageUrl;

    public PlaceImage(Long placeId, String imageUrl) {
        this.placeId = placeId;
        this.imageUrl = imageUrl;
    }
}
