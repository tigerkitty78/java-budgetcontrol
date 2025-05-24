package com.example.employaa.JWT;
import io.jsonwebtoken.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWT_util {
//    private String secretKey = "CkRQXRi7Cryu5O2Y1wqZrCV+DZuCCRjcaoVnMZDst0M=\n"; // Change this to a stronger secret key
//
//    private final long expirationMs = 86400000; // 24 hours

    private final String secretString = "CkRQXRi7Cryu5O2Y1wqZrCV+DZuCCRjcaoVnMZDst0M="; // Removed \n at end
    private final SecretKey secretKey = new SecretKeySpec(secretString.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    private final long expirationMs = 86400000;

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

//    public boolean validateToken(String token) {
//        try {
//            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
//            return true;
//        } catch (Exception e) {
//            // Handle specific exceptions
//            return false;
//        }
//    }
}
