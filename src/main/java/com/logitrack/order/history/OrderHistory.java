package com.logitrack.order.history;

import com.logitrack.order.Order;
import com.logitrack.user.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

// Entity đại diện cho bảng 'order_status_history'
@Entity
@Table(name = "order_status_history")
@Data
public class OrderHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với đơn hàng
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String status;

    // Người thực hiện thay đổi
    @ManyToOne
    @JoinColumn(name = "changed_by")
    private User changedBy;

    private String note;

    @Column(name = "changed_at")
    private LocalDateTime changedAt;

    @PrePersist
    protected void onCreate() {
        changedAt = LocalDateTime.now();
    }
}