import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import axiosClient để gọi API
import axiosClient from '../../api/axiosClient';

function DispatcherDashboard() {
    // 1. Khởi tạo state rỗng
    const [stats, setStats] = useState({
        pendingOrders: 0,
        assignedOrders: 0,
        inProgressOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect để gọi API
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API GET /api/dispatcher/dashboard-stats
                const response = await axiosClient.get('/dispatcher/dashboard-stats');

                const fetchedData = response.data.data || response.data; // Backend trả về {pendingOrders: ..., ...}

                setStats({
                    pendingOrders: fetchedData.pendingOrders || 0,
                    assignedOrders: fetchedData.assignedOrders || 0,
                    inProgressOrders: fetchedData.inProgressOrders || 0,
                });

            } catch (err) {
                console.error("Lỗi khi lấy thống kê Dispatcher dashboard:", err);
                setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
                setStats({ pendingOrders: 0, assignedOrders: 0, inProgressOrders: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dispatcher Dashboard</h1>

            {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Card Đơn chờ duyệt (dữ liệu thật) */}
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Đơn hàng chờ duyệt</h2>
                            <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
                            <Link
                                to="/dispatcher/pending"
                                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                            >
                                Xem danh sách
                            </Link>
                        </div>

                        {/* Card Đơn đã gán (dữ liệu thật) */}
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Đơn đã gán (chưa giao)</h2>
                            <p className="text-3xl font-bold text-yellow-600">{stats.assignedOrders}</p>
                        </div>

                        {/* Card Đơn đang giao (dữ liệu thật) */}
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <h2 className="text-sm font-medium text-gray-500 mb-1">Đơn đang Giao</h2>
                            <p className="text-3xl font-bold text-blue-600">{stats.inProgressOrders}</p>
                            <Link
                                to="/dispatcher/tracking"
                                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                            >
                                Theo dõi hành trình
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DispatcherDashboard;