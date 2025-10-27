import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getReportData } from '../../services/AdminService'; // Named import

function ReportPage() {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getReportData(); // Gọi API
                const fetchedData = response.data.data || response.data || [];

                // --- ĐẢM BẢO CẬP NHẬT STATE ---
                setReportData(fetchedData); // <<< SỬA LỖI: CẬP NHẬT STATE VỚI DỮ LIỆU
                // ---------------------------

            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu báo cáo:", err);
                setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại.");
                setReportData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Báo cáo Thống kê</h1>

            {loading && <p className="text-center text-gray-500">Đang tải dữ liệu báo cáo...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Số lượng đơn hàng theo Trạng thái</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        {/* Dùng dữ liệu 'reportData' từ state */}
                        <BarChart
                            data={reportData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#1976D2" name="Số lượng" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default ReportPage;