package com.logitrack.auth; // Hoặc package tương ứng của bạn

import com.logitrack.order.Order; // <<< BỔ SUNG IMPORT
import com.logitrack.order.OrderRepository;
import com.logitrack.user.User;
import com.logitrack.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List; // <<< BỔ SUNG IMPORT
import java.util.Map;

@RestController
@RequestMapping("/api/customer") // Base path cho Customer
public class CustomerController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public CustomerController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    // Hàm helper để lấy User entity từ JWT
    private User getCurrentUserEntity(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found from token"));
    }

    /**
     * API Lấy thống kê cho Customer Dashboard
     */
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Long>> getCustomerDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {

        User currentUser = getCurrentUserEntity(userDetails);

        // --- Tính toán số liệu ---
        long totalOrders = orderRepository.countByCustomer(currentUser);
        List<String> inProgressStatuses = Arrays.asList("Pending", "Assigned", "Delivering");
        long inProgressOrders = orderRepository.countByCustomerAndStatusIn(currentUser, inProgressStatuses);
        long completedOrders = orderRepository.countByCustomerAndStatus(currentUser, "Completed");
        // -----------------------

        Map<String, Long> stats = new HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("inProgressOrders", inProgressOrders);
        stats.put("completedOrders", completedOrders);

        return ResponseEntity.ok(stats);
    }

    // --- BỔ SUNG ENDPOINT LẤY ĐƠN HÀNG CỦA TÔI ---
    /**
     * API Lấy danh sách đơn hàng của Customer đang đăng nhập.
     * Cần quyền ROLE_CUSTOMER (đã cấu hình trong SecurityConfig).
     * @param userDetails Thông tin user được Spring Security chèn vào
     * @return Danh sách đơn hàng
     */
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        // 1. Lấy User entity
        User currentUser = getCurrentUserEntity(userDetails);

        // 2. Gọi phương thức repository mới
        List<Order> myOrders = orderRepository.findByCustomerOrderByCreatedAtDesc(currentUser);

        // 3. Trả về danh sách đơn hàng
        return ResponseEntity.ok(myOrders);
    }
    // --- KẾT THÚC BỔ SUNG ---

}