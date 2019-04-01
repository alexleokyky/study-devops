package ua.softserve.rv036.findmeplace.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import ua.softserve.rv036.findmeplace.model.User;
import ua.softserve.rv036.findmeplace.model.enums.Role;
import ua.softserve.rv036.findmeplace.payload.*;
import ua.softserve.rv036.findmeplace.repository.UserRepository;
import ua.softserve.rv036.findmeplace.security.JwtTokenProvider;
import ua.softserve.rv036.findmeplace.service.UserService;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Value("${basicFrontendURL}")
    private String frontendURL;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        final String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByNickNameOrEmail
                (loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail()).get();
        user.setLastUpdateDate(Instant.now());
        userRepository.save(user);
        Role role = user.getRole();
        Long id = user.getId();
        boolean isActive = user.isActive();
        String banStatus = String.valueOf(user.getBanStatus());

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt, role, id, isActive, banStatus));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByNickName(signUpRequest.getNickName())) {
            return new ResponseEntity(new ApiResponse(false, "Username is already taken!"),
                    HttpStatus.BAD_REQUEST);
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        User user = new User(signUpRequest.getEmail(),
                signUpRequest.getNickName(), signUpRequest.getPassword());

        boolean response = userService.createUser(user);
        if (response)
            return ResponseEntity.ok().body(new ApiResponse(true, "User registered successfully"));
        else
            return new ResponseEntity<>(new ApiResponse(false, "User isn't registered"), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/checkUserAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username, @RequestParam(value = "email") String email) {
        Boolean isNickNameAvailable = !userRepository.existsByNickName(username);
        Boolean isEmailAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isNickNameAvailable, isEmailAvailable);
    }

    @GetMapping("/activate/{code}")
    public ResponseEntity<ApiResponse> activate(@PathVariable String code) {
        User user = userRepository.findByActivationCode(code).orElseThrow(() ->
                new UsernameNotFoundException("User not found")
        );
        userService.activateUser(user);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(frontendURL + "sign-in"));
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        return new ResponseEntity<>(headers, HttpStatus.MOVED_PERMANENTLY);
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<ApiResponse> restorePassword(@RequestBody JsonNode node) {
        String email = node.get("email").asText();
        System.out.println(email);

        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new UsernameNotFoundException("User not found")
        );

        String restoreCode = UUID.randomUUID().toString();
        user.setActivationCode(restoreCode);
        userRepository.save(user);
        userService.sendRestoreEmail(user);

        return ResponseEntity.ok().body(new ApiResponse(true, restoreCode));

    }

    @PostMapping("/restore/{code}")
    public ResponseEntity<ApiResponse> restorePasswordConfirmation(
            @RequestBody JsonNode node,
            @PathVariable String code) {

        String password = node.get("password").asText();

        User user = userRepository.findByActivationCode(code).orElseThrow(() ->
                new UsernameNotFoundException("User not found")
        );
        user.setPassword(password);
        userService.restoreUserPassword(user);

        return ResponseEntity.ok().body(new ApiResponse(true, "Password successfully changed"));

    }

    @GetMapping("/resendEmail")
    public ApiResponse resendEmail(@RequestParam(value = "usernameOrEmail") String usernameOrEmail) {

        User user = userRepository.findByNickNameOrEmail
                (usernameOrEmail, usernameOrEmail).get();

        try {
            userService.sendEmailConfirmation(user);
        } catch (IOException e) {
            e.printStackTrace();
            return new ApiResponse(false, "Something goes wrong");
        }

        return new ApiResponse(true, "New email confirmation has been send");
    }

}
