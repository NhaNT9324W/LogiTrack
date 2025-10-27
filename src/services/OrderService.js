import axiosClient from '../api/axiosClient';

// Định nghĩa các endpoint API liên quan đến Order (chung)
const API_ENDPOINTS = {
    GET_PENDING_ORDERS: '/orders/pending',
    ASSIGN_ORDER: '/orders/assign', // Ví dụ: /orders/assign/1
    // (Thêm các API orders khác nếu cần)
};

const OrderService = {
    /**
     * Lấy danh sách các đơn hàng đang ở trạng thái "Pending".
     * Dùng cho Dispatcher.
     * @returns {Promise} Promise trả về từ axios
     */
    getPendingOrders: () => {
        return axiosClient.get(API_ENDPOINTS.GET_PENDING_ORDERS);
    },

    /**
     * Gán một đơn hàng cho shipper.
     * @param {number|string} orderId ID của đơn hàng
     * @param {number|string} shipperId ID của shipper được gán
     * @returns {Promise} Promise trả về từ axios
     */
    assignOrderToShipper: (orderId, shipperId) => {
        // API yêu cầu PUT /api/orders/assign/{orderId}
        // và body là { "shipperId": ... }
        const url = `${API_ENDPOINTS.ASSIGN_ORDER}/${orderId}`;
        const data = { shipperId: shipperId };
        return axiosClient.put(url, data);
    },

    // (Thêm các hàm service khác liên quan đến Order)
};

export default OrderService;