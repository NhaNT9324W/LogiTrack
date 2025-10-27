import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import useAuth

// Icon (dùng cho nút Logout)
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);

// Icon User
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

function Navbar() {
    // 2. Lấy user và hàm logout từ Context
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // 3. Hàm xử lý khi nhấn Đăng xuất
    const handleLogout = () => {
        logout(); // Xóa token và user khỏi Context/localStorage
        navigate('/login'); // Điều hướng về trang Login
    };

    return (
        <nav className="bg-[#1976D2] text-white shadow-md"> {/* Màu xanh chủ đạo [cite: 82] */}
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">

                {/* Logo/Brand */}
                <Link to="/" className="text-2xl font-bold uppercase tracking-wider">
                    LogiTrack
                </Link>

                {/* User Info & Logout Button */}
                <div className="flex items-center space-x-4">
                    {user ? ( // 4. Kiểm tra xem user đã đăng nhập chưa
                        <>
                            {/* Hiển thị tên user (lấy từ token) */}
                            <div className="flex items-center space-x-2">
                                <UserIcon />
                                <span className="hidden md:block font-medium">
                                    {user.username} (Role: {user.role})
                                </span>
                            </div>

                            {/* Nút Đăng xuất */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                            >
                                <LogoutIcon />
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        // (Nếu chưa đăng nhập, không hiển thị gì cả, vì Navbar bị ẩn)
                        null
                    )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;