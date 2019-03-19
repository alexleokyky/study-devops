package ua.softserve.rv036.findmeplace.payload;

import lombok.Data;
import ua.softserve.rv036.findmeplace.model.enums.BanStatus;
import ua.softserve.rv036.findmeplace.model.enums.Role;

@Data
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Role role;
    private Long userId;
    private boolean isActive;
    private String banStatus;

    public JwtAuthenticationResponse(String accessToken, Role role, Long userId, boolean isActive, String banStatus) {
        this.accessToken = accessToken;
        this.role = role;
        this.userId = userId;
        this.isActive = isActive;
        this.banStatus = banStatus;
    }
}