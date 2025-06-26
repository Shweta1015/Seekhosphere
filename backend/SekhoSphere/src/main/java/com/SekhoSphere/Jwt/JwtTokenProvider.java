package com.SekhoSphere.Jwt;

import com.SekhoSphere.Implementation.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;
// it will create a JWT token on successful authentication.
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExprirationInMs;
    public String generateToken(Authentication authentication){
        //debug log to inspect the principal
        System.out.println("Authentication principal: "+authentication.getPrincipal());

        if (!(authentication.getPrincipal() instanceof UserDetailsImpl)){
            throw new IllegalStateException("Expected UserDetailsImpl but got: "+authentication.getPrincipal().getClass().getName());
        }

        // Extract the authenticated user's details
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        System.out.println("Authenticated Username: "+userPrincipal.getUsername());

        //set token issue and expiration dates
        Date now = new Date();
        Date expireDate = new Date(now.getTime() + jwtExprirationInMs);

        //Generate and return the JWT token
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expireDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // Validate token by checking expiration and signature
    public boolean validateToken(String token) {
        try {
            // Parse the JWT token
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();

            // Check if the token is expired
            return !claims.getExpiration().before(new Date());
        } catch (SignatureException e) {
            // Invalid token signature
            System.out.println("Invalid JWT signature");
            return false;
        } catch (Exception e) {
            // Other errors (e.g., malformed token)
            System.out.println("JWT token validation failed: " + e.getMessage());
            return false;
        }
    }
}
