import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService';
import AssignShipperModal from '../../components/AssignShipperModal'; // <<< IMPORT MODAL

function AssignOrderPage() {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE CHO MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đang được chọn
    // -------------------------

    // Hàm lấy dữ liệu (giữ nguyên)
    const fetchPendingOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await OrderService.getPendingOrders();
            const data = response.data.data || response.data || [];
            setPendingOrders(data);
        } catch (err) {
            console.error("Lỗi khi lấy đơn hàng chờ duyệt:", err);
            setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại.");
            setPendingOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingOrders();
    }, []);

    // --- HÀM MỞ/ĐÓNG MODAL ---
    const handleOpenAssignModal = (order) => {
        setSelectedOrder(order); // Lưu đơn hàng được chọn
        setIsModalOpen(true); // Mở modal
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    // --- HÀM XỬ LÝ KHI MODAL SUBMIT ---
    const handleAssignSubmit = async (orderId, shipperId) => {
        console.log(`Đang gán đơn ${orderId} cho shipper ${shipperId}`);
        try {
            // Gọi API từ OrderService (chúng ta đã tạo hàm này ở Bước 1)
            await OrderService.assignOrderToShipper(orderId, shipperId);

            alert("Gán đơn hàng thành công!");
            handleCloseModal(); // Đóng modal
            fetchPendingOrders(); // Tải lại danh sách (đơn hàng đó sẽ biến mất khỏi list "Pending")

        } catch (err) {
            console.error("Lỗi khi gán đơn hàng:", err);
            // TODO: Hiển thị lỗi này bên trong modal thay vì alert
            alert(`Lỗi: ${err.response?.data?.message || err.message}`);
        }
    };
    // ---------------------------------

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Đơn Hàng Chờ Duyệt</h1>

            {loading && <p className="text-center text-gray-500">Đang tải...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {/* ... (giữ nguyên a href="#the-header" code) ... */}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingOrders.length > 0 ? (
                                pendingOrders.map((order) => (
                                    <tr key={order.id}>
                                        {/* ... (giữ nguyên các <td>) ... */}
                                        <td className="px-6 py-4 ...">{order.trackingCode}</td>
                                        <td className="px-6 py-4 ...">{order.customer?.fullName || 'N/A'}</td>
                                        <td className="px-6 py-4 ...">{order.pickupAddress}</td>
                                        <td className="px-6 py-4 ...">{order.deliveryAddress}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Cập nhật onClick */}
                                            <button
                                                onClick={() => handleOpenAssignModal(order)} // <<< GỌI HÀM MỞ MODAL
                                                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-xs"
                                            >
                                                Gán Shipper
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        Không có đơn hàng nào chờ duyệt.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- RENDER MODAL --- */}
            <AssignShipperModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleAssignSubmit}
                order={selectedOrder} // Truyền đơn hàng đang được chọn vào modal
            />
        </div>
    );
}

export default AssignOrderPage;