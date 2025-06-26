package com.SekhoSphere.DTOs;

import lombok.Data;

// this DTO will return the JWT token and a msg
@Data
public class LoginResponse {
    private String token;
    private String message;
    private String email;
    public LoginResponse(String token, String message, String email){
        this.token = token;
        this.message = message;
        this.email = email;
    }
}
