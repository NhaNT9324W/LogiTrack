package com.logitrack.common.dto;

import lombok.Data;

// DTO dùng khi Dispatcher gán đơn cho Shipper
@Data
public class AssignRequest {
    private Long shipperId;
}