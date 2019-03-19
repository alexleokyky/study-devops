package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private Long userId;
    private String firstName;
    private String lastName;
    private String nickName;
    private String email;
    private String phone;
    private String password;
    private String newPassword;
    private String confirmPassword;
}
