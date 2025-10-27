package com.logitrack.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Custom Exception khi không tìm thấy tài nguyên (ví dụ: Order, User)
@ResponseStatus(HttpStatus.NOT_FOUND) // Mã HTTP 404
public class ResourceNotFoundException extends RuntimeException {

    // Constructor nhận thông báo lỗi
    public ResourceNotFoundException(String message) {
        super(message);
    }
}