import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Để chuyển hướng sau khi tạo đơn
import CustomerService from '../../services/CustomerService'; // Import service
import { useAuth } from '../../context/AuthContext'; // Để lấy thông tin user (nếu cần)

function CreateOrderPage() {
    // State để lưu trữ dữ liệu form
    const [pickupAddress, setPickupAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [description, setDescription] = useState('');
    const [fee, setFee] = useState(''); // Lưu phí dưới dạng string để dễ nhập liệu
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth(); // Lấy thông tin customer nếu backend cần customerId

    // Hàm xử lý khi nhấn nút "Tạo đơn"
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Chuyển đổi phí sang số (BigDecimal/Double) nếu backend yêu cầu
        let numericFee = 0;
        try {
            // parseFloat cho phép số thập phân
            numericFee = parseFloat(fee);
            if (isNaN(numericFee) || numericFee < 0) {
                throw new Error("Phí vận chuyển không hợp lệ.");
            }
        } catch (parseError) {
            setError("Phí vận chuyển phải là một số hợp lệ.");
            setLoading(false);
            return;
        }

        // Tạo object dữ liệu đơn hàng để gửi đi
        const orderData = {
            // customerId: user.id, // Bỏ comment nếu backend cần ID, nếu không backend tự lấy từ token
            pickupAddress,
            deliveryAddress,
            description,
            fee: numericFee,
        };

        try {
            // Gọi API tạo đơn hàng
            const response = await CustomerService.createOrder(orderData);

            // Giả sử backend trả về thông tin đơn hàng đã tạo
            console.log("Tạo đơn hàng thành công:", response.data);

            // Chuyển hướng về trang danh sách đơn hàng (chúng ta sẽ tạo sau)
            // Tạm thời chuyển về Customer Dashboard
            navigate('/customer');

            // (Có thể hiển thị thông báo thành công bằng Toast sau này)

        } catch (err) {
            console.error("Lỗi khi tạo đơn hàng:", err);
            setError(err.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Tạo Đơn Hàng Mới</h1>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Địa chỉ lấy hàng */}
                    <div>
                        <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700">Địa chỉ lấy hàng</label>
                        <input
                            type="text"
                            id="pickupAddress"
                            value={pickupAddress}
                            onChange={(e) => setPickupAddress(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Địa chỉ giao hàng */}
                    <div>
                        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
                        <input
                            type="text"
                            id="deliveryAddress"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Mô tả đơn hàng */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả đơn hàng (vd: Laptop 2kg)</label>
                        <textarea
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* Phí vận chuyển (Ước tính) */}
                    <div>
                        <label htmlFor="fee" className="block text-sm font-medium text-gray-700">Phí vận chuyển (VNĐ)</label>
                        <input
                            type="number" // Dùng type number để trình duyệt hỗ trợ kiểm tra
                            id="fee"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            required
                            min="0" // Phí không âm
                            step="1000" // Bước nhảy (tùy chọn)
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Hiển thị lỗi */}
                    {error && (
                        <div className="text-sm text-red-600 text-center p-2 bg-red-50 rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Nút Submit */}
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Đang tạo...' : 'Tạo Đơn Hàng'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateOrderPage;