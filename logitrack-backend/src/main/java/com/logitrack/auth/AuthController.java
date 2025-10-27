package com.logitrack.auth;

import com.logitrack.common.dto.ApiResponse;
import com.logitrack.common.dto.LoginRequest;
import com.logitrack.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

// Controller xử lý API xác thực (Login/Register)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // API Đăng nhập
    // POST /api/auth/login (theo API chính: /api/auth/login) [cite: 245]
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestBody LoginRequest request) {
        // Thực hiện logic đăng nhập
        String jwt = authService.login(request);

        // Tạo response chứa JWT Token
        Map<String, String> responseData = new HashMap<>();
        responseData.put("token", jwt);

        // Trả về response thành công
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công, trả về JWT Token.", responseData));
    }

    // API Đăng ký tài khoản (chỉ Customer)
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody LoginRequest request) {
        // Thực hiện logic đăng ký
        User newUser = authService.register(request);

        // Trả về response thành công
        return ResponseEntity.ok(ApiResponse.success("Đăng ký tài khoản Customer thành công.", newUser));
    }
}