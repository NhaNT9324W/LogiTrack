import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// --- THAY ĐỔI IMPORT ---
import { getDashboardStats } from '../../services/AdminService'; // Import hàm cụ thể

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        activeShippers: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- THAY ĐỔI CÁCH GỌI ---
                const response = await getDashboardStats(); // Gọi trực tiếp hàm đã import

                const fetchedData = response.data.data || response.data;
                setStats({
                    totalUsers: fetchedData.totalUsers || 0,
                    totalOrders: fetchedData.totalOrders || 0,
                    activeShippers: fetchedData.activeShippers || 0,
                    pendingOrders: fetchedData.pendingOrders || 0,
                });
            } catch (err) {
                console.error("Lỗi khi lấy thống kê dashboard:", err);
                setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
                setStats({ totalUsers: 0, totalOrders: 0, activeShippers: 0, pendingOrders: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
            {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Tổng số Người dùng</h2>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Tổng số Đơn hàng</h2>
                            <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Shipper đang hoạt động</h2>
                            <p className="text-3xl font-bold text-yellow-600">{stats.activeShippers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Đơn hàng chờ duyệt</h2>
                            <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <Link
                            to="/admin/reports"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Xem Báo cáo chi tiết
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminDashboard;