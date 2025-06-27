package com.SekhoSphere.Services;

import com.SekhoSphere.Model.User;
import com.SekhoSphere.Repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private final Map<String, Pair<String, Long>> otpStore = new HashMap<>();  //OTP + Expiry

    //Method to generate OTP
    public String generateOTP(String email){
        Random random = new Random();
        String otp = String.valueOf(100000 + random.nextInt(900000));    //6-digit OTP
        long expireTime = System.currentTimeMillis() + (5 * 60 * 1000);  //OTP valid for 5 minutes

        otpStore.put(email, Pair.of(otp, expireTime));
        log.info("OTP generated for {}: ", email);
        return otp;
    }

    //Method to send OTP
    @Transactional
    public void sendOTPEmail(String toEmail, String otp) throws MessagingException{
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("Your OTP Code for Password Reset");
        helper.setText("Your OTP code is: <b>"+otp+"</b>. It will expire in 5 minute.", true);
        helper.setFrom("shweta.edu.22@gmail.com");

        mailSender.send(message);
        log.info("OTP email sent to {}", toEmail);
    }

    //Method to verify otp
    public boolean verifyOtp(String email, String enteredOtp){
        if (!otpStore.containsKey(email)){
            log.warn("No OTP found");
            return false;
        }
        Pair<String, Long> storedData = otpStore.get(email);
        String storedOtp = storedData.getLeft();
        long expireTime = storedData.getRight();

        if (System.currentTimeMillis() > expireTime){
            log.warn("OTP expired");
            otpStore.remove(email);    //Remove expired OTP
            return false;
        }

        if (storedOtp.equals(enteredOtp)){
            otpStore.remove(email);   //OTP is valid, remove it
            return true;
        }

        log.warn("Incorrect OTP entered ");
        return false;
    }

    //Method to update the reset password
    public boolean updatedPassword(String email, String newPassword){
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()){
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));  // Encrypt password before saving
            userRepository.save(user);
            log.info("Password updated successfully for {}", email);
            return true;
        }
        log.warn("Password reset failed, user not found: {}", email);
        return false;
    }
}
