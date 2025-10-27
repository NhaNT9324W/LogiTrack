package com.logitrack.admin; // Ensure this package matches your project structure

import com.logitrack.order.OrderRepository;
import com.logitrack.user.UserRepository;
import com.logitrack.user.role.Role; // Make sure Role is imported
import com.logitrack.user.role.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for administrative operations.
 * Requires ADMIN role for access to its endpoints.
 */
@RestController
@RequestMapping("/api/admin") // Base path for all admin endpoints
public class AdminController {

    // Inject required repositories via constructor
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final RoleRepository roleRepository;

    public AdminController(UserRepository userRepository, OrderRepository orderRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.roleRepository = roleRepository;
    }

    /**
     * Endpoint to get dashboard statistics.
     * Accessible only by users with the 'ROLE_ADMIN' authority.
     * @return A map containing various counts (totalUsers, totalOrders, etc.).
     */
    @GetMapping("/dashboard-stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Check for ADMIN authority (includes ROLE_ prefix)
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();

        // Count shippers by finding the SHIPPER role first
        long activeShippers = roleRepository.findByName("SHIPPER")
                .map(userRepository::countByRole) // Use method reference
                .orElse(0L); // Default to 0 if SHIPPER role doesn't exist

        long pendingOrders = orderRepository.countByStatus("Pending");

        // Prepare the response map
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalOrders", totalOrders);
        stats.put("activeShippers", activeShippers);
        stats.put("pendingOrders", pendingOrders);

        return ResponseEntity.ok(stats); // Return HTTP 200 OK with the stats map
    }

    /**
     * Endpoint to get order status report data for charting.
     * Accessible only by users with the 'ROLE_ADMIN' authority.
     * @return A list of maps, where each map represents a status and its count.
     */
    @GetMapping("/reports")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Check for ADMIN authority
    public ResponseEntity<List<Map<String, Object>>> getOrderStatusReport() {
        List<Map<String, Object>> reportData = new ArrayList<>();

        // Fetch counts for each relevant status
        long pendingCount = orderRepository.countByStatus("Pending");
        long assignedCount = orderRepository.countByStatus("Assigned");
        long deliveringCount = orderRepository.countByStatus("Delivering");
        long completedCount = orderRepository.countByStatus("Completed");
        long canceledCount = orderRepository.countByStatus("Canceled"); // Assuming 'Canceled' status exists

        // Build the list in the format expected by the frontend chart
        reportData.add(Map.of("status", "Pending", "count", pendingCount));
        reportData.add(Map.of("status", "Assigned", "count", assignedCount));
        reportData.add(Map.of("status", "Delivering", "count", deliveringCount));
        reportData.add(Map.of("status", "Completed", "count", completedCount));
        reportData.add(Map.of("status", "Canceled", "count", canceledCount));

        return ResponseEntity.ok(reportData); // Return HTTP 200 OK with the report data list
    }

    // Other Admin endpoints (like CRUD operations for users) might go here
    // or in UserController depending on your design.
}