package com.logitrack.common.dto; // Đảm bảo package khớp

import lombok.Data;
// import jakarta.validation.constraints.Email; // Có thể thêm validation sau

@Data // Lombok
public class UpdateUserRequest {

    // Username không được sửa, nên không cần trường username

    // @Email(message = "Email không hợp lệ")
    private String email;

    private String fullName;

    // Frontend sẽ gửi tên Role (vd: "CUSTOMER")
    private String role;
}