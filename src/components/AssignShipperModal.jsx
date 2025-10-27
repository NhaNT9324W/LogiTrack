import React, { useState, useEffect } from 'react';
// (Chúng ta sẽ tạo DispatcherService để lấy danh sách shipper sau)
// import DispatcherService from '../services/DispatcherService'; 

// Dữ liệu Shipper cứng (placeholder)
const availableShippers = [
    { id: 3, fullName: 'Shipper One' }, // Giả sử ship01 có id 3
    // Thêm các shipper khác nếu có...
];

function AssignShipperModal({ isOpen, onClose, onSubmit, order }) {
    const [shippers, setShippers] = useState(availableShippers); // Dùng data cứng
    const [selectedShipperId, setSelectedShipperId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // (useEffect để gọi API lấy danh sách Shipper rảnh sẽ thêm sau)
    // useEffect(() => {
    //   if (isOpen) {
    //     const fetchShippers = async () => { /* ... */ };
    //     fetchShippers();
    //   }
    // }, [isOpen]);

    // Reset state khi modal mở
    useEffect(() => {
        if (isOpen) {
            setSelectedShipperId(''); // Reset lựa chọn
            setError(null);
        }
    }, [isOpen]);

    // Nếu modal không mở hoặc không có order, không render
    if (!isOpen || !order) {
        return null;
    }

    // Hàm xử lý khi nhấn nút "Xác nhận Gán"
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedShipperId) {
            setError("Vui lòng chọn một Shipper.");
            return;
        }
        console.log(`Gán đơn ${order.id} cho Shipper ${selectedShipperId}`);
        // Gọi hàm onSubmit (từ AssignOrderPage)
        onSubmit(order.id, selectedShipperId);
    };

    return (
        // Lớp phủ nền mờ
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Nội dung Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Gán Đơn Hàng</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">Mã vận đơn: <strong className="font-medium">{order.trackingCode}</strong></p>
                    <p className="text-sm text-gray-600">Tuyến: {order.pickupAddress} &rarr; {order.deliveryAddress}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dropdown chọn Shipper */}
                    <div>
                        <label htmlFor="assign-shipper" className="block text-sm font-medium text-gray-700">Chọn Shipper <span className="text-red-500">*</span></label>
                        <select
                            id="assign-shipper"
                            value={selectedShipperId}
                            onChange={(e) => setSelectedShipperId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="" disabled>-- Chọn một shipper --</option>
                            {loading ? (
                                <option disabled>Đang tải danh sách...</option>
                            ) : (
                                shippers.map((shipper) => (
                                    <option key={shipper.id} value={shipper.id}>
                                        {shipper.fullName} (ID: {shipper.id})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    {/* Nút Submit và Cancel */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                        >
                            Xác nhận Gán
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssignShipperModal;