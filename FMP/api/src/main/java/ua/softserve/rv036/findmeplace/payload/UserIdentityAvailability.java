package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;

@Data
public class UserIdentityAvailability {
    private Boolean isNickNameAvailable;
    private Boolean isEmailAvailable;

    public UserIdentityAvailability(Boolean isNickNameAvailable, Boolean isEmailAvailable) {
        this.isNickNameAvailable = isNickNameAvailable;
        this.isEmailAvailable = isEmailAvailable;
    }
}
