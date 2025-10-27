import axiosClient from '../api/axiosClient';

// Định nghĩa các endpoint API liên quan đến Shipper
const API_ENDPOINTS = {
    // API để lấy các đơn hàng được gán cho shipper đang đăng nhập
    GET_MY_ORDERS: '/shipper/my-orders',
    // API để cập nhật trạng thái đơn hàng (sẽ dùng chung với OrderController)
    UPDATE_STATUS: '/orders' // (ví dụ: PUT /api/orders/1/status?action=start)
};

const ShipperService = {
    /**
     * Lấy danh sách các đơn hàng được gán cho shipper đang đăng nhập.
     * (Backend sẽ dựa vào JWT token để biết là shipper nào).
     * @returns {Promise} Promise trả về từ axios (GET /api/shipper/my-orders)
     */
    getMyOrders: () => {
        return axiosClient.get(API_ENDPOINTS.GET_MY_ORDERS);
    },

    /**
     * Cập nhật trạng thái đơn hàng (Bắt đầu giao hoặc Hoàn thành).
     * @param {number|string} orderId ID của đơn hàng
     * @param {string} action Hành động ('start' hoặc 'complete')
     * @returns {Promise} Promise trả về từ axios (PUT /api/orders/{id}/status)
     */
    updateOrderStatus: (orderId, action) => {
        const url = `${API_ENDPOINTS.UPDATE_STATUS}/${orderId}/status?action=${action}`;
        return axiosClient.put(url); // Không cần body, chỉ cần query param 'action'
    },
};

export default ShipperService;