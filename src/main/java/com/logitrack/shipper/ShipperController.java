package com.logitrack.shipper; // Đảm bảo package khớp

import com.logitrack.order.Order;
import com.logitrack.order.OrderRepository;
import com.logitrack.user.User;
import com.logitrack.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/shipper") // Base path cho Shipper
public class ShipperController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ShipperController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    // Hàm helper để lấy User entity từ JWT
    private User getCurrentUserEntity(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found from token"));
    }

    /**
     * API Lấy danh sách đơn hàng được gán cho Shipper đang đăng nhập.
     * Cần quyền ROLE_SHIPPER (sẽ cấu hình trong SecurityConfig).
     * @param userDetails Thông tin user được Spring Security chèn vào
     * @return Danh sách đơn hàng của shipper
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        // 1. Lấy User entity của shipper
        User currentShipper = getCurrentUserEntity(userDetails);

        // 2. Gọi phương thức repository mới
        List<Order> myOrders = orderRepository.findByShipperOrderByCreatedAtDesc(currentShipper);

        // 3. Trả về danh sách đơn hàng
        return ResponseEntity.ok(myOrders);
    }

    // (Các endpoint khác cho Shipper, vd: dashboard stats, sẽ thêm sau)
}