package com.SekhoSphere.Controller;

import com.SekhoSphere.DTOs.LoginRequest;
import com.SekhoSphere.DTOs.LoginResponse;
import com.SekhoSphere.Implementation.UserDetailsImpl;
import com.SekhoSphere.Implementation.UserDetailsServiceImpl;
import com.SekhoSphere.Jwt.JwtTokenProvider;
import com.SekhoSphere.Repository.UserRepository;
import com.SekhoSphere.Response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
            System.out.println("Authentication Successful");
            SecurityContextHolder.getContext().setAuthentication(authentication);

            //Generate Jwt Token
            String jwt = jwtTokenProvider.generateToken(authentication);

            //send back the token and user info
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String email = userDetails.getUsername();

            System.out.println("Authenticated user's email: " + email);
            return ResponseEntity.ok(new LoginResponse(jwt, "Login successful", email));
        }catch (BadCredentialsException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid email or password"));
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token){
        try {
            //Extract the token from the Authorization header
            String jwtToken = token.substring(7);   // Remove the Bearer prefix

            //validate the token
            if (jwtTokenProvider.validateToken(jwtToken)){
                return ResponseEntity.ok(new MessageResponse("Token is valid"));
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new MessageResponse("Invalid or expired token"));
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Token validation failed"));
        }
    }
}
