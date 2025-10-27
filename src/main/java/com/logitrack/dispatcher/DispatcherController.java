package com.logitrack.dispatcher; // Đảm bảo package khớp

import com.logitrack.order.Order; // <<< BỔ SUNG IMPORT
import com.logitrack.order.OrderRepository;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize; // Nếu dùng PreAuthorize
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List; // <<< BỔ SUNG IMPORT
import java.util.Map;

@RestController
@RequestMapping("/api/dispatcher")
public class DispatcherController {

    private final OrderRepository orderRepository;

    public DispatcherController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * API Lấy thống kê cho Dispatcher Dashboard.
     * Cần quyền ROLE_DISPATCHER (đã cấu hình trong SecurityConfig).
     */
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Long>> getDispatcherDashboardStats() {

        // Lấy số liệu thật từ Repository (VẪN DÙNG TIẾNG ANH)
        long pendingOrders = orderRepository.countByStatus("Đang chờ xử lý");
        long assignedOrders = orderRepository.countByStatus("Đã giao cho shipper");
        long inProgressOrders = orderRepository.countByStatus("Đang giao hàng"); // Trạng thái trong DB

        Map<String, Long> stats = new HashMap<>();
        stats.put("pendingOrders", pendingOrders);
        stats.put("assignedOrders", assignedOrders);
        stats.put("inProgressOrders", inProgressOrders);

        return ResponseEntity.ok(stats);
    }

    // --- BỔ SUNG API CHO TRANG "ĐƠN ĐANG GIAO" ---
    /**
     * API Lấy danh sách các đơn hàng đang ở trạng thái "Delivering".
     * Cần quyền ROLE_DISPATCHER (đã cấu hình trong SecurityConfig).
     * @return Danh sách các đơn hàng đang giao.
     */
    @GetMapping("/tracking")
    public ResponseEntity<List<Order>> getDeliveringOrders() {
        // Lấy danh sách đơn hàng thật (VẪN DÙNG TIẾNG ANH)
        List<Order> deliveringOrders = orderRepository.findByStatus("Đang giao hàng");

        // Backend trả về dữ liệu (bao gồm cả shipper do Eager Loading trong Order entity)
        return ResponseEntity.ok(deliveringOrders);
    }
    // --- KẾT THÚC BỔ SUNG ---
}