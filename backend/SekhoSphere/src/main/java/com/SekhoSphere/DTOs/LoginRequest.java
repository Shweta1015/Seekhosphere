package com.SekhoSphere.DTOs;

import lombok.Data;

//this DTO will hold the login data

@Data
public class LoginRequest {
    private String email;
    private String password;


}
