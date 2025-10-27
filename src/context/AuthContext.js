import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/AuthService';
import axiosClient from '../api/axiosClient';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userData = {
                    username: decodedToken.sub,
                    role: decodedToken.role,
                };
                setUser(userData);
                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setLoading(false);
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                localStorage.removeItem('authToken');
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await AuthService.login(username, password);

            // ---------------------------------------------------
            // ĐÂY LÀ DÒNG ĐÃ SỬA:
            // Chúng ta truy cập vào response.data.data.token
            // ---------------------------------------------------
            const newToken = response.data.data.token;

            if (!newToken) {
                throw new Error("Không tìm thấy token trong response (kiểm tra response.data.data.token)");
            }

            const decodedToken = jwtDecode(newToken);
            const userData = {
                username: decodedToken.sub,
                role: decodedToken.role,
            };

            localStorage.setItem('authToken', newToken);
            setToken(newToken);
            setUser(userData);
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return true; // Đăng nhập thành công
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            return false; // Đăng nhập thất bại
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        delete axiosClient.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};