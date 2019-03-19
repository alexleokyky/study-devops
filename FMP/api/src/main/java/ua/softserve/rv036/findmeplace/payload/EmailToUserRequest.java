package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class EmailToUserRequest {
    @NotNull
    Long userId;

    String subject;
    String message;
}
