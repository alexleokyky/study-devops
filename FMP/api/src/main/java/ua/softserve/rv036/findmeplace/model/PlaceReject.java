package ua.softserve.rv036.findmeplace.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "place_rejects")
public class PlaceReject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reject_message")
    private String rejectMessage;

    @NotNull
    @Column(name = "place_id")
    private Long placeId;
}
