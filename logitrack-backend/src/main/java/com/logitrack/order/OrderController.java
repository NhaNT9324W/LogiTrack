package com.logitrack.order; // Đảm bảo package khớp

import com.logitrack.common.dto.ApiResponse;
import com.logitrack.common.dto.AssignRequest;
import com.logitrack.common.dto.OrderRequest;
import com.logitrack.gps.GpsTracking;
import com.logitrack.gps.GpsTrackingRepository;
import com.logitrack.user.User;
import com.logitrack.user.UserRepository; // <<< BỔ SUNG IMPORT UserRepository
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository; // <<< THÊM OrderRepository
    private final GpsTrackingRepository gpsTrackingRepository;
    private final UserRepository userRepository; // <<< THÊM UserRepository

    // Cập nhật Constructor để inject OrderRepository và UserRepository
    public OrderController(OrderService orderService,
                           OrderRepository orderRepository, // <<< Thêm
                           GpsTrackingRepository gpsTrackingRepository,
                           UserRepository userRepository // <<< Thêm
    ) {
        this.orderService = orderService;
        this.orderRepository = orderRepository; // <<< Gán
        this.gpsTrackingRepository = gpsTrackingRepository;
        this.userRepository = userRepository; // <<< Gán
    }

    // Helper lấy User entity (Đã hoàn thiện hơn)
    private User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String username = ((UserDetails) authentication.getPrincipal()).getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user ứng với token: " + username));
        }
        throw new RuntimeException("Không thể xác định người dùng hiện tại từ Security Context.");
    }

    // Helper lấy ID (Đã hoàn thiện hơn)
    private Long getCurrentUserId() {
        return getCurrentUserEntity().getId();
    }

    /**
     * API: Customer tạo đơn hàng mới.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody OrderRequest request) {
        Long customerId = getCurrentUserId();
        Order newOrder = orderService.createOrder(request, customerId);
        return ResponseEntity.ok(ApiResponse.success("Đơn hàng được tạo thành công.", newOrder));
    }

    /**
     * API: Dispatcher xem danh sách đơn hàng đang chờ duyệt.
     */
    @GetMapping("/pending")
    // @PreAuthorize("hasAuthority('ROLE_DISPATCHER')")
    public ResponseEntity<ApiResponse<List<Order>>> getPendingOrders() {
        List<Order> pendingOrders = orderService.getPendingOrders();
        return ResponseEntity.ok(ApiResponse.success("Danh sách đơn hàng chờ duyệt.", pendingOrders));
    }

    /**
     * API: Dispatcher gán đơn hàng cho Shipper.
     */
    @PutMapping("/assign/{orderId}")
    // @PreAuthorize("hasAuthority('ROLE_DISPATCHER')")
    public ResponseEntity<ApiResponse<Order>> assignOrder(@PathVariable Long orderId, @RequestBody AssignRequest request) {
        Long dispatcherId = getCurrentUserId();
        Order assignedOrder = orderService.assignOrder(orderId, request.getShipperId(), dispatcherId);
        return ResponseEntity.ok(ApiResponse.success("Đã gán đơn hàng thành công.", assignedOrder));
    }

    /**
     * API: Shipper cập nhật trạng thái đơn hàng.
     */
    @PutMapping("/{orderId}/status")
    // @PreAuthorize("hasAuthority('ROLE_SHIPPER')")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(@PathVariable Long orderId, @RequestParam String action) {
        Long shipperId = getCurrentUserId();

        Order updatedOrder;
        String message;
        if ("start".equalsIgnoreCase(action)) {
            updatedOrder = orderService.startDelivery(orderId, shipperId);
            message = "Đã bắt đầu giao hàng. GPS mô phỏng kích hoạt.";
        } else if ("complete".equalsIgnoreCase(action)) {
            updatedOrder = orderService.completeDelivery(orderId, shipperId);
            message = "Đã hoàn thành giao hàng.";
        } else {
            throw new IllegalArgumentException("Hành động không hợp lệ: " + action + ". Chỉ chấp nhận 'start' hoặc 'complete'.");
        }
        return ResponseEntity.ok(ApiResponse.success(message, updatedOrder));
    }

    /**
     * API: Lấy dữ liệu hành trình GPS cho một đơn hàng.
     */
    @GetMapping("/{id}/track")
    public ResponseEntity<List<GpsTracking>> getOrderTracking(@PathVariable Long id) {
        // === SỬA LỖI 1: Gọi findById trên instance repository ===
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        // TODO: Kiểm tra quyền truy cập của user hiện tại với đơn hàng này

        // === SỬA LỖI 2 (giả định): Gọi đúng phương thức trong GpsTrackingRepository ===
        // Đảm bảo bạn đã khai báo phương thức này trong GpsTrackingRepository.java
        List<GpsTracking> trackingData = gpsTrackingRepository.findByOrderOrderByRecordedAtAsc(order);

        return ResponseEntity.ok(trackingData);
    }
}