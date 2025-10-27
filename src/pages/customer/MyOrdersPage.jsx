import React, { useState, useEffect } from 'react'; // <<< Đảm bảo có useEffect
import { Link } from 'react-router-dom';
import CustomerService from '../../services/CustomerService'; // <<< Bỏ comment import

// Xóa mảng myOrdersData (dữ liệu cứng)

// Cấu hình cột (giữ nguyên)
const columns = [
    { accessorKey: 'trackingCode', header: 'Mã Vận Đơn' },
    { accessorKey: 'description', header: 'Mô tả' },
    { accessorKey: 'status', header: 'Trạng thái' },
    { accessorKey: 'createdAt', header: 'Ngày tạo' }, // Cần đảm bảo backend trả về key này
];


function MyOrdersPage() {
    // 1. Khởi tạo state rỗng
    const [orders, setOrders] = useState([]); // <<< Khởi tạo mảng rỗng
    const [loading, setLoading] = useState(true); // <<< Đặt loading là true
    const [error, setError] = useState(null);

    // 2. useEffect để gọi API
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                // Gọi API từ CustomerService
                const response = await CustomerService.getMyOrders();
                // Backend trả về trong data.data hoặc data
                const data = response.data.data || response.data || [];
                setOrders(data); // Cập nhật state với dữ liệu thật
            } catch (err) {
                console.error("Lỗi khi lấy đơn hàng của tôi:", err);
                setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders(); // Gọi hàm
    }, []); // Mảng rỗng nghĩa là chỉ chạy 1 lần khi trang tải

    // 3. Hàm format ngày (Tùy chọn, nếu backend trả về timestamp đầy đủ)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('vi-VN');
        } catch (e) {
            return dateString; // Trả về nguyên bản nếu không phải ngày
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Đơn Hàng Của Tôi</h1>

            {/* 4. Hiển thị Loading/Error */}
            {loading && <p className="text-center text-gray-500">Đang tải danh sách đơn hàng...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {/* ... (Header table giữ nguyên) ... */}
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
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                                                order.status === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'Đã giao cho shiper' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'Đang chờ xử lý' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-red-100 text-red-800' // Canceled
                                                }`}>
                                                {order.status}
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