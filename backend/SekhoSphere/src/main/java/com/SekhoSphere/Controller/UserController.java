package com.SekhoSphere.Controller;

import com.SekhoSphere.Model.User;
import com.SekhoSphere.Services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    public final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user){
        try{
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);  //return the created user details
        }catch (Exception e){
            return ResponseEntity.status(400).body("Error Creating user: "+e.getMessage());
        }
    }
}
