package com.logitrack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Lớp cấu hình CORS (Cross-Origin Resource Sharing)
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cho phép Frontend (ReactJS) gọi API từ Backend
        registry.addMapping("/**") // Áp dụng cho tất cả các endpoint
                .allowedOrigins("http://localhost:3000") // Thay bằng URL của Frontend ReactJS
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép các phương thức này
                .allowedHeaders("*") // Cho phép tất cả các header
                .allowCredentials(true); // Cho phép truyền cookie/xác thực
    }
}