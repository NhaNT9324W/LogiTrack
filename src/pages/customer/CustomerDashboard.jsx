import React, { useState, useEffect } from 'react'; // Import hooks
import { Link } from 'react-router-dom';
import CustomerService from '../../services/CustomerService'; // Import service

console.log('Imported CustomerService:', CustomerService);

function CustomerDashboard() {
    // 1. State để lưu dữ liệu lấy về và trạng thái loading/lỗi
    const [stats, setStats] = useState({
        totalOrders: 0,
        inProgressOrders: 0,
        completedOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect để lấy dữ liệu khi component được mount
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi hàm API từ CustomerService
                const response = await CustomerService.getDashboardStats();

                // Giả sử backend trả về dữ liệu trong response.data hoặc response.data.data
                const fetchedData = response.data.data || response.data;

                // Cập nhật state
                setStats({
                    totalOrders: fetchedData.totalOrders || 0,
                    inProgressOrders: fetchedData.inProgressOrders || 0, // Key này cần khớp backend
                    completedOrders: fetchedData.completedOrders || 0, // Key này cần khớp backend
                });

            } catch (err) {
                console.error("Lỗi khi lấy thống kê Customer dashboard:", err);
                setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
                setStats({ totalOrders: 0, inProgressOrders: 0, completedOrders: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Customer Dashboard</h1>

            {/* 3. Hiển thị Loading hoặc Error */}
            {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* 4. Hiển thị Stats khi không loading/lỗi */}
            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Các thẻ hiển thị dữ liệu từ state 'stats' */}
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Tổng số Đơn hàng</h2>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Đơn đang xử lý</h2>
                            <p className="text-3xl font-bold text-yellow-600">{stats.inProgressOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Đơn đã hoàn thành</h2>
                            <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Link
                            to="/customer/create"
                            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-medium"
                        >
                            + Tạo Đơn Hàng Mới
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default CustomerDashboard;