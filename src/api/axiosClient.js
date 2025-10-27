import axios from 'axios';

// Cấu hình URL backend của bạn
// (Hãy đảm bảo backend Spring Boot của bạn đang chạy ở port 8080)
const BASE_URL = 'http://localhost:8080/api';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Cấu hình Interceptor (cho JWT) ---
// Chúng ta sẽ thêm phần này sau khi code AuthContext
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosClient;