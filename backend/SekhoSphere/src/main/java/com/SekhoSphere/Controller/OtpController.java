package com.SekhoSphere.Controller;

import com.SekhoSphere.Services.EmailService;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class OtpController {
    @Autowired
    private EmailService emailService;

    //Endpoint to send OTP
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> requestBody){
        Map<String, String> response = new HashMap<>();
        try{
            String email = requestBody.get("email");    //extract email from request body
            if (email == null || email.isEmpty()){
                response.put("error", "Email is required.");
                return ResponseEntity.badRequest().body(response);
            }

            String otp = emailService.generateOTP(email);   //pass email to store otp
            emailService.sendOTPEmail(email, otp);     //send otp via mail

            response.put("message", "OTP sent successfully,");
            return ResponseEntity.ok(response);
        } catch (MessagingException e) {
            log.error("Failed to send OTP to {}", requestBody.get("email"), e);
            response.put("error", "Failed to send OTP.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    //Endpoint to verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> requestBody){
        String email = requestBody.get("email");
        String otp = requestBody.get("otp");

        log.info("Verifying otp for: {}", email);

        Map<String, Object> response = new HashMap<>();
        boolean isVerified = emailService.verifyOtp(email, otp);

        if (isVerified){
            response.put("success", true);
            response.put("message", "OTP verified successfully");
            return ResponseEntity.ok(response);
        }else {
            log.warn("Invalid OTP attempt for {}", email);
            response.put("success", false);
            response.put("message", "Invalid or expired OTP.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> requestBody){
        String email = requestBody.get("email");
        String newPassword = requestBody.get("newPassword");

        log.info("Resetting password for {}", email);

        boolean isUpdated = emailService.updatedPassword(email, newPassword);   // Call service to update password

        Map<String, String> response = new HashMap<>();
        if (isUpdated){
            response.put("message", "Password reset successfully");
            return ResponseEntity.ok(response);
        }else {
            response.put("message", "Failed to reset password. Email not found.");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
