package com.logitrack.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Lớp DTO chuẩn hóa phản hồi API (dùng cho mọi Controller)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    // Mã trạng thái HTTP (ví dụ: 200, 400, 500)
    private int status;
    // Thông báo lỗi hoặc thành công
    private String message;
    // Dữ liệu trả về
    private T data;

    // Phương thức tĩnh cho phản hồi thành công (200 OK)
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    // Phương thức tĩnh cho phản hồi lỗi (Internal Server Error)
    public static <T> ApiResponse<T> error(int status, String message) {
        return new ApiResponse<>(status, message, null);
    }
}