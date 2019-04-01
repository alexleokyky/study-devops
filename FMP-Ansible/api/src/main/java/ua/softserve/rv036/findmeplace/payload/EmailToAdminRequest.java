package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class EmailToAdminRequest {
    @NotBlank
    String userEmail;

    String subject;
    String message;
}
