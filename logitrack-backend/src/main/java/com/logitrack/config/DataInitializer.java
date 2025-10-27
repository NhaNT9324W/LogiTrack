package com.logitrack.config;

import com.logitrack.order.Order;
import com.logitrack.order.OrderRepository;
import com.logitrack.order.history.OrderHistoryRepository;
import com.logitrack.user.User;
import com.logitrack.user.UserRepository;
import com.logitrack.user.role.Role;
import com.logitrack.user.role.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.logitrack.order.history.OrderHistory; // Import OrderHistory

import java.math.BigDecimal; // Import cho trường phí
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final OrderRepository orderRepository; // Bổ sung
    private final OrderHistoryRepository historyRepository; // Bổ sung
    private final PasswordEncoder passwordEncoder;

    // Tiêm các dependencies cần thiết
    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, OrderRepository orderRepository, OrderHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.orderRepository = orderRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        final String RAW_PASSWORD = "ntn93";

        // --- 1. CHÈN USERS (Nếu chưa có) ---
        if (userRepository.findByUsername("admin01").isEmpty()) {

            // Lấy Roles từ CSDL (Flyway V2 đã chạy)
            Role adminRole = roleRepository.findByName("ADMIN").orElseThrow();
            Role dispRole = roleRepository.findByName("DISPATCHER").orElseThrow();
            Role shipRole = roleRepository.findByName("SHIPPER").orElseThrow();
            Role custRole = roleRepository.findByName("CUSTOMER").orElseThrow();

            String encodedPassword = passwordEncoder.encode(RAW_PASSWORD);

            // Tạo và lưu Users
            User admin = userRepository.save(createUser("admin01", encodedPassword, "Admin One", adminRole));
            User dispatcher = userRepository.save(createUser("disp01", encodedPassword, "Dispatcher One", dispRole));
            User shipper = userRepository.save(createUser("ship01", encodedPassword, "Shipper One", shipRole));
            User customer = userRepository.save(createUser("cus01", encodedPassword, "Customer One", custRole));

            // --- 2. CHÈN ORDERS VÀ HISTORY (Phần này đã được chuyển từ V3.sql) ---

            // Đơn hàng 1: Đã được gán
            Order order1 = new Order();
            order1.setTrackingCode("LT-20251025-0001");
            order1.setCustomer(customer);
            order1.setDispatcher(dispatcher);
            order1.setShipper(shipper);
            order1.setDescription("Giao laptop 2kg");
            order1.setPickupAddress("Số 1, Đường A, Cần Thơ");
            order1.setDeliveryAddress("Số 10, Quận 1, TP.HCM");
            order1.setStatus("Đã gán");
            order1.setFee(new BigDecimal("120000.00"));
            Order savedOrder1 = orderRepository.save(order1);

            // Lịch sử Đơn 1
            historyRepository.save(createHistory(savedOrder1, "Chờ xử lý", customer, "Khách tạo đơn"));
            historyRepository.save(createHistory(savedOrder1, "Đã gán", dispatcher, "Dispatcher gán shipper ship01"));

            // Đơn hàng 2: Pending
            Order order2 = new Order();
            order2.setTrackingCode("LT-20251025-0002");
            order2.setCustomer(customer);
            order2.setDescription("Gửi tài liệu 0.5kg");
            order2.setPickupAddress("Bình Thạnh, HCM");
            order2.setDeliveryAddress("Quận 3, HCM");
            order2.setStatus("Chờ xử lý");
            order2.setFee(new BigDecimal("30000.00"));
            Order savedOrder2 = orderRepository.save(order2);

            // Lịch sử Đơn 2
            historyRepository.save(createHistory(savedOrder2, "Chờ xử lý", customer, "Khách tạo đơn"));

            System.out.println("Tạo dữ liệu mẫu (Users, Orders, History) thành công với mật khẩu đã mã hóa.");
        }
    }

    // Hàm tiện ích tạo User
    private User createUser(String username, String encodedPassword, String fullName, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setFullName(fullName);
        user.setEmail(username + "@example.com");
        user.setRole(role);
        return user;
    }

    // Hàm tiện ích tạo History
    private OrderHistory createHistory(Order order, String status, User changedBy, String note) {
        OrderHistory history = new OrderHistory();
        history.setOrder(order);
        history.setStatus(status);
        history.setChangedBy(changedBy);
        history.setNote(note);
        return history;
    }
}