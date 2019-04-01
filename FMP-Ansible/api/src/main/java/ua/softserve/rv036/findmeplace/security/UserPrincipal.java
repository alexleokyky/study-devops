package ua.softserve.rv036.findmeplace.security;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import ua.softserve.rv036.findmeplace.model.User;

import java.util.*;

@Data
public class UserPrincipal implements UserDetails {
    private Long id;

    private String firstName;

    private String lastName;

    private String nickName;

    private String phone;

    @JsonIgnore
    private String email;

    @JsonIgnore
    private String password;

    private String role;

    private String banStatus;

    private List<GrantedAuthority> authorities;

    public UserPrincipal(Long id, String firstName, String lastName,
                         String nickName, String email, String password,
                         String role, String banStatus, List<GrantedAuthority> authorities, String phone) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nickName = nickName;
        this.email = email;
        this.password = password;
        this.banStatus = banStatus;
        this.authorities = authorities;
        this.role = role;
        this.phone = phone;
    }

    public static UserPrincipal create(User user) {

        String roleName = user.getRole().name();
        String banStatusName = user.getBanStatus().name();

        List<GrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority(roleName), new SimpleGrantedAuthority(banStatusName));

        return new UserPrincipal(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getNickName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole().name(),
                user.getBanStatus().name(),
                authorities,
                user.getPhone()
        );
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return nickName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

   }
