import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Hook để lấy tham số từ URL
import CustomerService from '../../services/CustomerService'; // Service để gọi API tracking

function TrackingPage() {
    // 1. Lấy orderId từ URL (ví dụ: /customer/tracking/1 -> orderId = '1')
    const { orderId } = useParams();

    // State để lưu thông tin đơn hàng và hành trình
    const [order, setOrder] = useState(null);
    const [trackingData, setTrackingData] = useState([]); // Mảng tọa độ GPS
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. useEffect để lấy dữ liệu tracking khi orderId thay đổi
    useEffect(() => {
        if (!orderId) return; // Không làm gì nếu không có orderId

        const fetchOrderAndTracking = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- Gọi API lấy thông tin cơ bản của đơn hàng (VÍ DỤ) ---
                // (Bạn cần implement endpoint này ở backend, ví dụ GET /api/orders/{id})
                // const orderResponse = await OrderService.getOrderById(orderId); // Giả sử có OrderService
                // setOrder(orderResponse.data); 
                // Dùng dữ liệu cứng tạm thời:
                setOrder({
                    id: orderId,
                    trackingCode: `LT-20251026-${orderId.padStart(4, '0')}`,
                    status: 'Delivering', // Giả sử đang giao
                    pickupAddress: 'Điểm A',
                    deliveryAddress: 'Điểm B'
                });

                // --- Gọi API lấy dữ liệu tracking GPS (VÍ DỤ) ---
                const trackingResponse = await CustomerService.trackOrderById(orderId);
                // Giả sử backend trả về mảng tọa độ [{ lat: ..., lng: ..., recordedAt: ... }]
                setTrackingData(trackingResponse.data.data || trackingResponse.data || []);

            } catch (err) {
                console.error(`Lỗi khi lấy thông tin đơn hàng ${orderId}:`, err);
                setError("Không thể tải thông tin theo dõi đơn hàng.");
                setOrder(null);
                setTrackingData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderAndTracking();
    }, [orderId]); // Chạy lại khi orderId thay đổi

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Theo dõi Đơn Hàng</h1>

            {loading && <p className="text-center text-gray-500">Đang tải thông tin...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && order && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Chi tiết đơn: {order.trackingCode}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <p><span className="font-medium">Trạng thái:</span> {order.status}</p>
                        <p><span className="font-medium">Từ:</span> {order.pickupAddress}</p>
                        <p><span className="font-medium">Đến:</span> {order.deliveryAddress}</p>
                    </div>

                    {/* ----- Phần Bản Đồ sẽ thêm ở đây ----- */}
                    <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-2">Hành trình (Mô phỏng)</h3>
                        {trackingData.length > 0 ? (
                            <p>Đã nhận được {trackingData.length} điểm GPS từ backend.</p>
                            // Component <MapSimulation> sẽ được thêm vào đây
                        ) : (
                            <p className="text-gray-500">Chưa có dữ liệu hành trình hoặc đơn hàng chưa bắt đầu giao.</p>
                        )}
                    </div>
                    {/* ------------------------------------- */}

                </div>
            )}
            {!loading && !error && !order && (
                <p className="text-center text-gray-500">Không tìm thấy thông tin đơn hàng.</p>
            )}
        </div>
    );
}

export default TrackingPage;