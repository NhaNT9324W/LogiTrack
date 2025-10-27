import axiosClient from '../api/axiosClient';

const API_ENDPOINTS = {
    GET_DASHBOARD_STATS: '/admin/dashboard-stats',
    GET_USERS: '/users',
    ADD_USER: '/users',
    GET_REPORTS: '/admin/reports',
};

/**
 * Lấy số liệu thống kê cho Admin Dashboard.
 */
export const getDashboardStats = () => { // <<< THÊM export
    return axiosClient.get(API_ENDPOINTS.GET_DASHBOARD_STATS);
};

/**
 * Lấy danh sách tất cả người dùng.
 */
export const getAllUsers = () => { // <<< THÊM export
    return axiosClient.get(API_ENDPOINTS.GET_USERS);
};

/**
 * Lấy dữ liệu báo cáo.
 */
export const getReportData = () => { // <<< THÊM export
    return axiosClient.get(API_ENDPOINTS.GET_REPORTS);
};

/**
 * Gọi API để tạo một người dùng mới.
 */
export const addUser = (userData) => { // <<< THÊM export
    const requestData = {
        username: userData.username,
        password: userData.password,
        email: userData.email,
        fullName: userData.fullName || null,
        role: userData.role
    };
    return axiosClient.post(API_ENDPOINTS.ADD_USER, requestData);
};

// --- XÓA DÒNG export default AdminService; ---