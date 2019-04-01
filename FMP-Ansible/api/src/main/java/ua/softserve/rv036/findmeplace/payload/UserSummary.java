package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;
import ua.softserve.rv036.findmeplace.model.enums.BanStatus;

@Data
public class UserSummary {
    private Long id;
    private String username;
    private String role;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String banStatus;

    public UserSummary(Long id, String username, String role, String banStatus) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.banStatus = banStatus;
    }
}



