package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;

import javax.validation.constraints.*;

@Data
public class SignUpRequest {


    @NotBlank
    @Size(min = 3, max = 15)
    private String nickName;

    @NotBlank
    @Size(max = 40)
    @Email
    private String email;

    @NotBlank
    @Size(min = 3, max = 20)
    private String password;


}
