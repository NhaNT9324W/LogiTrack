package com.logitrack.common.dto;

import lombok.Data;
import java.math.BigDecimal;

// DTO dùng khi Customer tạo đơn hàng
@Data
public class OrderRequest {
    private String description;
    private String pickupAddress;
    private String deliveryAddress;
    private BigDecimal fee;
}