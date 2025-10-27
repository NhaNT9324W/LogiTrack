package com.logitrack.order;

import com.logitrack.common.dto.OrderRequest;
import com.logitrack.common.exception.ResourceNotFoundException;
import com.logitrack.gps.GpsService; // Import GpsService
import com.logitrack.order.history.OrderHistory;
import com.logitrack.order.history.OrderHistoryRepository;
import com.logitrack.user.User;
import com.logitrack.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

// Lớp Service xử lý logic nghiệp vụ cho Đơn hàng
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderHistoryRepository historyRepository;
    private final GpsService gpsService; // <<< KHAI BÁO GpsService CẦN THIẾT CHO AUTOWIRING

    // Constructor để Spring tự động tiêm tất cả dependencies
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, OrderHistoryRepository historyRepository, GpsService gpsService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.historyRepository = historyRepository;
        this.gpsService = gpsService; // Khởi tạo GpsService
    }

    /**
     * Customer tạo đơn hàng mới. (UC03, TC04)
     * @param request Dữ liệu đơn hàng
     * @param customerId ID của Customer đang đăng nhập
     * @return Order đã tạo
     */
    @Transactional
    public Order createOrder(OrderRequest request, Long customerId) {
        // 1. Tìm Customer
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer không tồn tại."));

        // 2. Tạo Tracking Code (ví dụ: LT-YYYYMMDD-XXXX)
        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String trackingCode = "LT-" + today + "-" + (orderRepository.count() + 1); // Logic đơn giản

        // 3. Tạo Order
        Order newOrder = new Order();
        newOrder.setTrackingCode(trackingCode);
        newOrder.setCustomer(customer);
        newOrder.setDescription(request.getDescription());
        newOrder.setPickupAddress(request.getPickupAddress());
        newOrder.setDeliveryAddress(request.getDeliveryAddress());
        newOrder.setFee(request.getFee());
        newOrder.setStatus("Pending"); // Trạng thái ban đầu: Pending [cite: 84]

        Order savedOrder = orderRepository.save(newOrder);

        // 4. Lưu lịch sử trạng thái
        saveHistory(savedOrder, "Pending", customer, "Khách hàng tạo đơn.");

        return savedOrder;
    }

    /**
     * Dispatcher gán đơn hàng cho Shipper. (UC04, TC06)
     * @param orderId ID của đơn hàng cần gán
     * @param shipperId ID của Shipper được gán
     * @param dispatcherId ID của Dispatcher
     * @return Order đã được cập nhật
     */
    @Transactional
    public Order assignOrder(Long orderId, Long shipperId, Long dispatcherId) {
        // 1. Tìm Order và kiểm tra trạng thái
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại."));

        if (!order.getStatus().equals("Pending")) {
            throw new RuntimeException("Chỉ có thể gán đơn hàng đang ở trạng thái Pending.");
        }

        // 2. Tìm Shipper và Dispatcher
        User shipper = userRepository.findById(shipperId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipper không tồn tại."));

        User dispatcher = userRepository.findById(dispatcherId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispatcher không tồn tại."));

        // 3. Cập nhật thông tin và trạng thái
        order.setShipper(shipper);
        order.setDispatcher(dispatcher);
        order.setStatus("Assigned"); // Trạng thái mới: Assigned [cite: 30]

        Order assignedOrder = orderRepository.save(order);

        // 4. Lưu lịch sử trạng thái
        saveHistory(assignedOrder, "Assigned", dispatcher, "Dispatcher gán đơn cho shipper: " + shipper.getUsername());

        return assignedOrder;
    }

    /**
     * Shipper bắt đầu giao hàng. (UC05, TC07)
     * Đơn hàng chuyển sang trạng thái Delivering và kích hoạt mô phỏng GPS.
     * @param orderId ID của đơn hàng
     * @param shipperId ID của Shipper
     * @return Order đã được cập nhật
     */
    @Transactional
    public Order startDelivery(Long orderId, Long shipperId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại."));

        // Kiểm tra trạng thái và shipper gán
        if (!order.getStatus().equals("Assigned") || !order.getShipper().getId().equals(shipperId)) {
            throw new RuntimeException("Đơn hàng không thể bắt đầu giao hoặc không được gán cho shipper này.");
        }

        order.setStatus("Delivering"); // Trạng thái mới: Delivering
        Order updatedOrder = orderRepository.save(order);

        // Kích hoạt Timer mô phỏng GPS [cite: 37]
        gpsService.startTracking(orderId);

        // Lưu lịch sử trạng thái
        User shipper = userRepository.findById(shipperId).get();
        saveHistory(updatedOrder, "Delivering", shipper, "Shipper bắt đầu giao hàng.");

        return updatedOrder;
    }

    /**
     * Shipper hoàn thành đơn hàng. (UC05, TC08)
     * Đơn hàng chuyển sang Completed và dừng mô phỏng GPS.
     * @param orderId ID của đơn hàng
     * @param shipperId ID của Shipper
     * @return Order đã được cập nhật
     */
    @Transactional
    public Order completeDelivery(Long orderId, Long shipperId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng không tồn tại."));

        if (!order.getStatus().equals("Delivering") || !order.getShipper().getId().equals(shipperId)) {
            throw new RuntimeException("Đơn hàng không thể hoàn thành.");
        }

        order.setStatus("Completed"); // Trạng thái mới: Completed [cite: 40]
        Order updatedOrder = orderRepository.save(order);

        // Dừng mô phỏng GPS
        gpsService.stopTracking(orderId);

        // Lưu lịch sử trạng thái
        User shipper = userRepository.findById(shipperId).get();
        saveHistory(updatedOrder, "Completed", shipper, "Shipper đã hoàn thành giao hàng.");

        return updatedOrder;
    }

    /**
     * Lấy danh sách đơn hàng đang chờ duyệt (Pending) cho Dispatcher. (TC05)
     * @return Danh sách Order Pending
     */
    public List<Order> getPendingOrders() {
        return orderRepository.findByStatus("Pending");
    }

    // Phương thức tiện ích để lưu lịch sử trạng thái
    private void saveHistory(Order order, String status, User changedBy, String note) {
        OrderHistory history = new OrderHistory();
        history.setOrder(order);
        history.setStatus(status);
        history.setChangedBy(changedBy);
        history.setNote(note);
        historyRepository.save(history);
    }
}