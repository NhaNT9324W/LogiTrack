package com.logitrack.gps;

import com.logitrack.order.Order;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

// Entity đại diện cho bảng 'gps_tracking'
@Entity
@Table(name = "gps_tracking")
@Data
public class GpsTracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với đơn hàng đang được theo dõi
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Tọa độ Vĩ độ
    private Double latitude;

    // Tọa độ Kinh độ
    private Double longitude;

    // Thời gian ghi nhận
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        recordedAt = LocalDateTime.now();
    }
}