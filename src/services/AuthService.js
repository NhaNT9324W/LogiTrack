import axiosClient from '../api/axiosClient';

// API Endpoints dựa trên tài liệu SDD [cite: 562]
const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
};

const AuthService = {
    // Hàm gọi API đăng nhập
    login: (username, password) => {
        // Dữ liệu gửi đi (LoginRequest DTO)
        const data = { username, password };
        // Gọi API POST /api/auth/login
        return axiosClient.post(API_ENDPOINTS.LOGIN, data);
    },

    // Hàm đăng ký (cho Customer)
    register: (userData) => {
        return axiosClient.post(API_ENDPOINTS.REGISTER, userData);
    },

    // (Chúng ta sẽ thêm các hàm logout, getCurrentUser sau...)
};

export default AuthService;