package com.logitrack.gps;

import com.logitrack.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Controller cung cấp API GPS Tracking
@RestController
@RequestMapping("/api/gps")
public class GpsController {

    private final GpsService gpsService;

    public GpsController(GpsService gpsService) {
        this.gpsService = gpsService;
    }

    // API: Lấy hành trình GPS của một đơn hàng (UC06)
    // GET /api/orders/{id}/track (từ SDD) -> đổi thành /api/gps/track/{id} để dễ quản lý module
    @GetMapping("/track/{orderId}")
    public ResponseEntity<ApiResponse<List<GpsTracking>>> getTrackingHistory(@PathVariable Long orderId) {
        // Lấy danh sách tọa độ
        List<GpsTracking> history = gpsService.getTrackingHistory(orderId);
        return ResponseEntity.ok(ApiResponse.success("Lấy hành trình GPS thành công.", history));
    }
}