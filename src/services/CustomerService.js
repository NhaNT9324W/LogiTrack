import axiosClient from '../api/axiosClient';

// Định nghĩa các endpoint API của Customer
const API_ENDPOINTS = {
  GET_DASHBOARD_STATS: '/customer/dashboard-stats', // Endpoint ví dụ cho thống kê
  CREATE_ORDER: '/orders',                          // Endpoint từ SDD
  GET_MY_ORDERS: '/customer/orders',                // Endpoint ví dụ (lấy đơn hàng của tôi)
  TRACK_ORDER: '/orders/{id}/track',                // Endpoint từ SDD (cần thay {id})
};

const CustomerService = {
  /**
   * Lấy số liệu thống kê dashboard cho Customer đang đăng nhập.
   * Backend sẽ xác định user dựa trên JWT token được gửi kèm.
   * @returns {Promise} Promise trả về từ axios
   */
  getDashboardStats: () => {
    return axiosClient.get(API_ENDPOINTS.GET_DASHBOARD_STATS);
  },

  /**
   * Tạo một đơn hàng mới.
   * @param {object} orderData Dữ liệu đơn hàng (ví dụ: { pickupAddress, deliveryAddress, description, fee })
   * @returns {Promise} Promise trả về từ axios
   */
  createOrder: (orderData) => {
    return axiosClient.post(API_ENDPOINTS.CREATE_ORDER, orderData);
  },

  /**
   * Lấy danh sách các đơn hàng đã tạo bởi Customer đang đăng nhập.
   * @returns {Promise} Promise trả về từ axios
   */
  getMyOrders: () => {
    return axiosClient.get(API_ENDPOINTS.GET_MY_ORDERS);
  },

  /**
   * Lấy thông tin theo dõi (hành trình GPS) của một đơn hàng cụ thể.
   * @param {number|string} orderId ID của đơn hàng cần theo dõi
   * @returns {Promise} Promise trả về từ axios
   */
  trackOrderById: (orderId) => {
    // Thay thế placeholder {id} trong URL bằng orderId thực tế
    const url = API_ENDPOINTS.TRACK_ORDER.replace('{id}', orderId);
    return axiosClient.get(url);
  },

  // Có thể thêm các hàm gọi API khác cho Customer ở đây nếu cần...
};

// Xuất object CustomerService để các component khác có thể import và sử dụng
export default CustomerService;