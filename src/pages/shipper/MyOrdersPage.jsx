import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerService from '../../services/CustomerService';

// Cấu hình cột
const columns = [
    { accessorKey: 'trackingCode', header: 'Mã Vận Đơn' },
    { accessorKey: 'description', header: 'Mô tả' },
    { accessorKey: 'status', header: 'Trạng thái' },
    { accessorKey: 'createdAt', header: 'Ngày tạo' },
];

// === BƯỚC 1: TẠO HÀM DỊCH TRẠNG THÁI ===
/**
 * Dịch trạng thái từ Tiếng Anh (lưu trong DB) sang Tiếng Việt (hiển thị UI)
 * @param {string} status Trạng thái tiếng Anh (vd: "Pending")
 * @returns {string} Trạng thái tiếng Việt (vd: "Đang chờ duyệt")
 */
const translateStatus = (status) => {
    switch (status) {
        case 'Pending':
            return 'Đang chờ duyệt';
        case 'Assigned':
            return 'Đã giao cho shiper'; // <<< Dịch theo yêu cầu của bạn
        case 'Delivering':
            return 'Đang vận chuyển';
        case 'Completed':
            return 'Hoàn thành';
        case 'Canceled':
            return 'Đã hủy';
        default:
            return status; // Trả về nguyên bản nếu không khớp
    }
};
// ======================================


function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect để gọi API (Giữ nguyên)
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await CustomerService.getMyOrders();
                const data = response.data.data || response.data || [];
                setOrders(data);
            } catch (err) {
                console.error("Lỗi khi lấy đơn hàng của tôi:", err);
                setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Hàm format ngày (Cải tiến để chỉ lấy ngày)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            // Tách ngày ra khỏi timestamp (ví dụ: "2025-10-26T10:00:00")
            const date = dateString.split('T')[0];
            // Chuyển "YYYY-MM-DD" thành "DD/MM/YYYY"
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`;
        } catch (e) {
            return dateString; // Trả về nguyên bản nếu không phải ngày
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Đơn Hàng Của Tôi</h1>

            {loading && <p className="text-center text-gray-500">Đang tải danh sách đơn hàng...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.accessorKey} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {col.header}
                                    </th>
                                ))}
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Hành động</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.trackingCode}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{order.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {/* === BƯỚC 2: SỬ DỤNG HÀM DỊCH === */}
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Delivering' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'Pending' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-red-100 text-red-800' // Canceled
                                                }`}>
                                                {translateStatus(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/customer/tracking/${order.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                Xem chi tiết / Theo dõi
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">
                                        Bạn chưa có đơn hàng nào.
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

export default MyOrdersPage;