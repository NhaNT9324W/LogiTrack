package com.logitrack.order;

import com.logitrack.user.User; // Import User entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Import List

/**
 * Spring Data JPA repository for {@link Order} entities.
 * Provides standard CRUD operations and custom query methods.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Finds a list of orders based on their status.
     * Used by Dispatcher to find pending orders.
     * @param status The status to search for (e.g., "Pending").
     * @return A list of orders matching the status.
     */
    List<Order> findByStatus(String status);

    /**
     * Counts the total number of orders for a specific status.
     * Used for Admin Dashboard and Admin Reports.
     * @param status The status to count.
     * @return The number of orders with the specified status.
     */
    long countByStatus(String status);

    // --- Methods for CustomerController ---

    /**
     * Counts the total number of orders belonging to a specific customer.
     * Used for Customer Dashboard.
     * @param customer The customer (User entity) whose orders are to be counted.
     * @return The total number of orders for that customer.
     */
    long countByCustomer(User customer);

    /**
     * Counts the number of orders for a specific customer that have a status within the given list.
     * Used for Customer Dashboard (e.g., counting in-progress orders).
     * @param customer The customer (User entity).
     * @param statuses A list of statuses to check against (e.g., ["Pending", "Assigned", "Delivering"]).
     * @return The number of orders matching the criteria.
     */
    long countByCustomerAndStatusIn(User customer, List<String> statuses);

    /**
     * Counts the number of orders for a specific customer with a specific status.
     * Used for Customer Dashboard (e.g., counting completed orders).
     * @param customer The customer (User entity).
     * @param status The specific status to count (e.g., "Completed").
     * @return The number of orders matching the criteria.
     */
    long countByCustomerAndStatus(User customer, String status);

    /**
     * Tìm tất cả đơn hàng của một Customer cụ thể, sắp xếp theo ngày tạo (mới nhất trước).
     * Dùng cho trang "Đơn hàng của tôi".
     * @param customer User (Customer)
     * @return Danh sách đơn hàng đã sắp xếp.
     */
    List<Order> findByCustomerOrderByCreatedAtDesc(User customer);

    /**
     * Tìm tất cả đơn hàng được gán cho một Shipper cụ thể.
     * Sắp xếp theo trạng thái (vd: "Assigned" và "Delivering" lên đầu)
     * hoặc theo ngày tạo.
     * @param shipper User (Shipper)
     * @return Danh sách đơn hàng của shipper đó.
     */
    List<Order> findByShipperOrderByCreatedAtDesc(User shipper);

    // --- End Methods for CustomerController ---

    // You can add more custom query methods here as needed, for example:
    // List<Order> findByCustomerOrderByCreatedAtDesc(User customer); // Get all orders for a customer, newest first
    // List<Order> findByShipperAndStatus(User shipper, String status); // Get orders for a specific shipper with a specific status

}