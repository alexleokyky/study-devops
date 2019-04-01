package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class MarkRequest {

    @NotBlank
    private Integer mark;

    @NotBlank
    private Long userId;

    @NotBlank
    private Long placeId;

}

