package ua.softserve.rv036.findmeplace.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ua.softserve.rv036.findmeplace.model.audit.DateAudit;
import ua.softserve.rv036.findmeplace.model.enums.BanStatus;
import ua.softserve.rv036.findmeplace.model.enums.Role;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "users")
public class User extends DateAudit {

    public User(@NotBlank @Email String email, @NotBlank String nickName, @NotBlank String password) {
        this.email = email;
        this.nickName = nickName;
        this.password = password;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @NotBlank
    @Column(name = "nick_name")
    private String nickName;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "ban_status")
    @Enumerated(EnumType.STRING)
    private BanStatus banStatus;

    @Column(name = "is_active")
    private boolean isActive;

    @JsonIgnore
    @Column(name = "activationCode")
    private String activationCode;

    @Column(name = "avatar_url")
    private String avatarUrl;
}
