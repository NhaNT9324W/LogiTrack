package com.logitrack.gps;

import com.logitrack.order.Order; // <<< BỔ SUNG IMPORT Order
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository để thao tác với bảng gps_tracking
@Repository
public interface GpsTrackingRepository extends JpaRepository<GpsTracking, Long> {
    // Lấy tất cả tọa độ theo Order ID (dùng cho API Tracking)
    List<GpsTracking> findByOrderId(Long orderId);

    // Lấy tọa độ cuối cùng của một đơn hàng
    GpsTracking findTopByOrderIdOrderByRecordedAtDesc(Long orderId);

    /**
     * Tìm tất cả các bản ghi GpsTracking cho một Order cụ thể,
     * sắp xếp theo thời gian ghi nhận (recordedAt) tăng dần.
     * @param order Order cần tìm GpsTracking.
     * @return Danh sách GpsTracking đã sắp xếp.
     */
    List<GpsTracking> findByOrderOrderByRecordedAtAsc(Order order); // <<< KHAI BÁO PHƯƠNG THỨC NÀY
}