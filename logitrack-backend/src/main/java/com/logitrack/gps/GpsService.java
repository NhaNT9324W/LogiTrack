package com.logitrack.gps;

import com.logitrack.order.Order;
import com.logitrack.order.OrderRepository;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.List;

// Lớp Service xử lý logic mô phỏng GPS
@Service
@EnableScheduling // Kích hoạt tính năng lập lịch (Scheduler) cho GPS mô phỏng
public class GpsService {

    private final GpsTrackingRepository gpsRepository;
    private final OrderRepository orderRepository;

    // Lưu trữ trạng thái mô phỏng: Order ID -> Vị trí hiện tại (latitude, longitude)
    private final Map<Long, GpsTracking> activeTracks = new ConcurrentHashMap<>();

    // Constructor để Spring tự động tiêm các dependencies
    public GpsService(GpsTrackingRepository gpsRepository, OrderRepository orderRepository) {
        this.gpsRepository = gpsRepository;
        this.orderRepository = orderRepository;
        // Tải các đơn hàng đang 'Delivering' khi ứng dụng khởi động (nếu có)
    }

    /**
     * Khởi động quá trình mô phỏng GPS cho một đơn hàng (UC05).
     * @param orderId ID của đơn hàng
     */
    @Transactional
    public void startTracking(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng."));

        // Kiểm tra nếu đã có trong danh sách theo dõi
        if (activeTracks.containsKey(orderId)) {
            return; // Đã chạy, không chạy lại
        }

        // Thiết lập vị trí bắt đầu (Giả định tọa độ cố định của điểm lấy hàng đầu tiên)
        // Ví dụ: Lấy tọa độ của Cần Thơ (vị trí lấy hàng mẫu)
        GpsTracking initialPoint = new GpsTracking();
        initialPoint.setOrder(order);
        initialPoint.setLatitude(10.045162); // Vĩ độ Cần Thơ (tọa độ mẫu)
        initialPoint.setLongitude(105.746857); // Kinh độ Cần Thơ (tọa độ mẫu)

        gpsRepository.save(initialPoint);
        activeTracks.put(orderId, initialPoint);
    }

    /**
     * Dừng quá trình mô phỏng GPS cho một đơn hàng (sau khi hoàn thành hoặc hủy).
     * @param orderId ID của đơn hàng
     */
    public void stopTracking(Long orderId) {
        activeTracks.remove(orderId);
    }

    /**
     * Lấy hành trình GPS của một đơn hàng (UC06).
     * @param orderId ID của đơn hàng
     * @return Danh sách các tọa độ
     */
    public List<GpsTracking> getTrackingHistory(Long orderId) {
        // Sử dụng Repository để truy vấn tất cả các tọa độ đã lưu theo orderId
        return gpsRepository.findByOrderId(orderId);
    }

    /**
     * Hàm lập lịch mô phỏng sinh tọa độ ngẫu nhiên.
     * Chạy mỗi 5 giây (theo yêu cầu mô phỏng trong tài liệu).
     */
    @Scheduled(fixedRate = 5000) // Chạy mỗi 5000 milliseconds (5 giây)
    @Transactional
    public void simulateGpsMovement() {
        if (activeTracks.isEmpty()) {
            return;
        }

        // Lặp qua tất cả các đơn hàng đang được theo dõi
        activeTracks.forEach((orderId, lastPoint) -> {
            // Lấy Order từ Repository
            Order order = orderRepository.findById(orderId).orElse(null);

            // Chỉ mô phỏng nếu đơn hàng đang ở trạng thái 'Delivering'
            if (order != null && "Delivering".equals(order.getStatus())) {

                // Sinh tọa độ ngẫu nhiên gần vị trí trước đó (mô phỏng di chuyển)
                double newLat = lastPoint.getLatitude() + (Math.random() - 0.5) * 0.0005;
                double newLng = lastPoint.getLongitude() + (Math.random() - 0.5) * 0.0005;

                GpsTracking newPoint = new GpsTracking();
                newPoint.setOrder(order);
                newPoint.setLatitude(newLat);
                newPoint.setLongitude(newLng);

                // Lưu dữ liệu vào CSDL
                gpsRepository.save(newPoint);

                // Cập nhật vị trí cuối cùng trong cache
                activeTracks.put(orderId, newPoint);
            } else {
                // Nếu trạng thái không phải Delivering, dừng theo dõi
                stopTracking(orderId);
            }
        });
    }
}