package com.logitrack.order;

import com.logitrack.user.User;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// Entity đại diện cho bảng 'orders'
@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String trackingCode;

    // Liên kết Customer (người tạo đơn)
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Liên kết Dispatcher (người gán đơn)
    @ManyToOne
    @JoinColumn(name = "dispatcher_id")
    private User dispatcher;

    // Liên kết Shipper (người giao hàng)
    @ManyToOne
    @JoinColumn(name = "shipper_id")
    private User shipper;

    private String description;
    private String pickupAddress;
    private String deliveryAddress;

    @Column(nullable = false)
    private String status = "Pending"; // Mặc định là Pending

    private BigDecimal fee;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thiết lập thời gian tạo/cập nhật
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}