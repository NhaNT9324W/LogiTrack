package com.logitrack.common.dto;

import lombok.Data;
// Import validation annotations (optional but recommended)
// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size;

@Data // Lombok annotation cho getters/setters/constructor...
public class CreateUserRequest {

    // @NotBlank(message = "Username không được để trống")
    // @Size(min = 3, message = "Username phải có ít nhất 3 ký tự")
    private String username;

    // @NotBlank(message = "Password không được để trống")
    // @Size(min = 6, message = "Password phải có ít nhất 6 ký tự")
    private String password;

    // @Email(message = "Email không hợp lệ")
    private String email;

    // @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    // @NotBlank(message = "Vai trò không được để trống")
    private String role; // Frontend sẽ gửi tên Role (vd: "CUSTOMER")
}