package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class BanPlace {
    @NotBlank
    private Long placeId;
    @NotBlank
    private String message;
}
