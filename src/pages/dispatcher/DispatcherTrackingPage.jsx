import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient'; // <<< IMPORT AXIOS

// Xóa mảng deliveringOrders (dữ liệu cứng)

function DispatcherTrackingPage() {
    const [orders, setOrders] = useState([]); // <<< KHỞI TẠO STATE RỖNG
    const [loading, setLoading] = useState(true); // <<< ĐẶT LOADING LÀ TRUE
    const [error, setError] = useState(null);

    // === HÀM DỊCH TRẠNG THÁI (THEO YÊU CẦU CỦA BẠN) ===
    const translateStatus = (status) => {
        switch (status) {
            case 'Pending':
                return 'Đang chờ duyệt';
            case 'Assigned':
                return 'Đã gán';
            case 'Delivering':
                return 'Đang giao';
            case 'Completed':
                return 'Hoàn thành';
            case 'Canceled':
                return 'Đã hủy';
            default:
                return status;
        }
    };
    // =============================================

    // useEffect để gọi API lấy danh sách đơn "Delivering"
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API mới (GET /api/dispatcher/tracking)
                const response = await axiosClient.get('/dispatcher/tracking');
                const data = response.data.data || response.data || [];
                setOrders(data); // Cập nhật state với dữ liệu thật
            } catch (err) {
                console.error("Lỗi khi lấy đơn hàng đang giao:", err);
                setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []); // Chỉ chạy 1 lần

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Theo dõi Đơn Hàng Đang Giao</h1>

            {loading && <p className="text-center text-gray-500">Đang tải danh sách...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Vận Đơn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipper</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.trackingCode}</td>
                                        {/* Backend trả về order.shipper (object User) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shipper?.fullName || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {/* === SỬ DỤNG HÀM DỊCH === */}
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {translateStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Link đến trang tracking chi tiết */}
                                            <Link to={`/customer/tracking/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                Xem hành trình
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        Không có đơn hàng nào đang được giao.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DispatcherTrackingPage;