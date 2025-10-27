import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import AuthService from '../../services/AuthService'; // Import AuthService để gọi API trực tiếp

function LoginPage() {
    const [username, setUsername] = useState('cus01');
    const [password, setPassword] = useState('ntn93');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth(); // Vẫn dùng login của context để lưu state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const loginResponse = await AuthService.login(username, password);
            const token = loginResponse?.data?.data?.token;
            if (!token) {
                // Thử kiểm tra nếu backend trả về token trực tiếp (không lồng trong data.data)
                const directToken = loginResponse?.data?.token;
                if (!directToken) {
                    throw new Error("Đăng nhập thành công nhưng không nhận được token.");
                }
                // Nếu tìm thấy token trực tiếp, dùng nó
                // (Code xử lý token trực tiếp sẽ giống bên dưới, bạn có thể gộp lại nếu muốn)
                const decodedTokenDirect = jwtDecode(directToken);
                const userRoleDirect = decodedTokenDirect.role;
                // ... (Gọi context login và điều hướng) ...
                // Tạm thời báo lỗi nếu cấu trúc không như data.data.token
                throw new Error("Cấu trúc response token không đúng (mong đợi data.data.token).");

            }

            // --- Logic điều hướng theo Role ---
            try {
                const decodedToken = jwtDecode(token);
                const userRole = decodedToken.role;

                // Gọi lại hàm login context để lưu state và user
                const contextLoginSuccess = await login(username, password); // Hàm login context tự xử lý lưu token/user

                if (!contextLoginSuccess) {
                    // Hàm login context cũng có thể thất bại (vd: token lỗi sau khi backend trả về)
                    setError("Lưu thông tin đăng nhập thất bại.");
                    throw new Error("Lưu thông tin đăng nhập vào context thất bại.");
                }


                // Điều hướng dựa trên role
                switch (userRole) {
                    case 'ADMIN':
                        navigate('/admin');
                        break;
                    case 'DISPATCHER':
                        navigate('/dispatcher');
                        break;
                    case 'SHIPPER':
                        navigate('/shipper');
                        break;
                    case 'CUSTOMER':
                        navigate('/customer');
                        break;
                    default:
                        console.error("Vai trò không xác định:", userRole);
                        navigate('/');
                }
            } catch (decodeOrContextError) {
                console.error("Lỗi giải mã token hoặc lưu context:", decodeOrContextError);
                setError("Token không hợp lệ hoặc lỗi lưu trữ.");
            }
            // --- Kết thúc Logic điều hướng ---

        } catch (err) {
            console.error("Lỗi API đăng nhập:", err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Tên đăng nhập hoặc mật khẩu không đúng.');
            } else {
                setError('Lỗi kết nối máy chủ hoặc lỗi không xác định.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">

                <div className="text-center">
                    {/* ... Tiêu đề ... */}
                    <h1 className="text-3xl font-bold text-gray-900">LogiTrack</h1>
                    <p className="mt-2 text-sm text-gray-600">Đăng nhập hệ thống quản lý vận chuyển</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        {/* ... Username Input ... */}
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input id="username" name="username" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="admin01" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} />
                    </div>

                    <div>
                        {/* ... Password Input ... */}
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input id="password" name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                    </div>

                    {/* --- ĐÂY LÀ DÒNG ĐÃ SỬA --- */}
                    {/* Hiển thị lỗi nếu có */}
                    {error && (
                        <div className="text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}
                    {/* --- KẾT THÚC DÒNG SỬA --- */}


                    <div>
                        {/* ... Nút Đăng nhập ... */}
                        <button type="submit" className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}> {loading ? 'Đang xử lý...' : 'Đăng nhập'} </button>
                    </div>
                </form>

                <div className="text-sm text-center">
                    {/* ... Link Đăng ký ... */}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500"> Chưa có tài khoản? Đăng ký (vai trò Customer) </Link>
                </div>

            </div>
        </div>
    );
}

export default LoginPage;