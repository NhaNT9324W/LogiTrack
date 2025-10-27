package com.logitrack.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// Lớp tiện ích xử lý JWT (tạo, xác thực token)
@Component
public class JwtUtil {

    // CHUỖI SECRET DÀI VÀ BASE64-ENCODED
    private final String SECRET = "logitrack_jwt_secret_key_long_enough_for_security_testing_base64_encoded";

    // Khởi tạo Key MỘT LẦN duy nhất từ chuỗi Base64
    private final Key key;

    // Thời gian hiệu lực của token: 24 giờ
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    public JwtUtil() {
        // Sử dụng SECRET.getBytes() trực tiếp để tạo Key, đảm bảo tính nhất quán
        this.key = Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // --- LOGIC TẠO TOKEN ---

    public String generateToken(String username, String roleName) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", roleName);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // --- LOGIC GIẢI MÃ VÀ XÁC THỰC (Phần đã được triển khai trước đó) ---

    private Claims extractAllClaims(String token) throws ExpiredJwtException {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (ExpiredJwtException e) {
            return false;
        }
    }
}