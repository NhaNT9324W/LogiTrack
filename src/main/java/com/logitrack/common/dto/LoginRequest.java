package com.logitrack.common.dto;

import lombok.Data; // Sử dụng Lombok để tự động tạo getter/setter

// Lớp DTO dùng để nhận dữ liệu khi người dùng đăng nhập
@Data
public class LoginRequest {
    // Tên đăng nhập
    private String username;
    // Mật khẩu
    private String password;
}