package com.logitrack.order.history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repository để thao tác với bảng order_status_history
@Repository
public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {
}