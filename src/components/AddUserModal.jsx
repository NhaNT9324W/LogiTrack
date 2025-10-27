import React, { useState } from 'react';

/**
 * Component Modal (Hộp thoại) để thêm người dùng mới.
 * @param {boolean} isOpen Trạng thái mở/đóng của modal.
 * @param {function} onClose Hàm callback để đóng modal.
 * @param {function} onSubmit Hàm callback được gọi khi form submit thành công,
 * nhận vào object chứa dữ liệu user mới.
 */
function AddUserModal({ isOpen, onClose, onSubmit }) {
    // State để lưu trữ dữ liệu form
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState(''); // <<< THÊM STATE fullName
    const [role, setRole] = useState('CUSTOMER'); // Mặc định là Customer

    // Nếu modal không mở, không render gì cả
    if (!isOpen) {
        return null;
    }

    // Hàm xử lý khi submit form
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn form reload trang

        // Tạo object user mới từ state
        const newUser = { username, password, email, fullName, role }; // <<< THÊM fullName VÀO OBJECT
        console.log("Submitting new user (from modal):", newUser); // Log dữ liệu gửi đi

        // Gọi hàm onSubmit được truyền từ component cha (ManageUsersPage)
        onSubmit(newUser); // <<< KÍCH HOẠT onSubmit

        // (Tùy chọn: Chỉ đóng modal nếu onSubmit thành công. Hiện tại đóng ngay lập tức)
        // onClose(); // Tạm thời comment dòng này lại, ManageUsersPage sẽ đóng sau khi API thành công
    };

    // Hàm reset form khi modal đóng (để lần mở sau form trống)
    const handleClose = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setFullName('');
        setRole('CUSTOMER');
        onClose(); // Gọi hàm onClose gốc
    }

    return (
        // Lớp phủ nền mờ (Backdrop)
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
            {/* Nội dung Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"> {/* Thêm hiệu ứng */}
                {/* Header Modal */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b"> {/* Thêm border */}
                    <h2 className="text-xl font-semibold text-gray-800">Thêm Người Dùng Mới</h2>
                    {/* Nút đóng modal */}
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                {/* Form thêm user */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label htmlFor="add-username" className="block text-sm font-medium text-gray-700">Username <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="add-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="off" // Tắt gợi ý username
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="add-password" className="block text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            id="add-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6} // Thêm yêu cầu độ dài tối thiểu nếu cần
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="new-password" // Gợi ý tạo mật khẩu mới
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="add-email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="add-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // Email có thể không bắt buộc, tùy yêu cầu
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="off"
                        />
                    </div>

                    {/* Full Name <<< THÊM TRƯỜNG NÀY */}
                    <div>
                        <label htmlFor="add-fullName" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                        <input
                            type="text"
                            id="add-fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            // Họ tên có thể không bắt buộc
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            autoComplete="name" // Gợi ý tên
                        />
                    </div>
                    {/* --- KẾT THÚC THÊM --- */}


                    {/* Role (Dropdown) */}
                    <div>
                        <label htmlFor="add-role" className="block text-sm font-medium text-gray-700">Vai trò <span className="text-red-500">*</span></label>
                        <select
                            id="add-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            {/* Lấy danh sách vai trò từ backend hoặc định nghĩa sẵn */}
                            {/* Đảm bảo value khớp với tên Role trong backend */}
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="SHIPPER">SHIPPER</option>
                            <option value="DISPATCHER">DISPATCHER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    {/* Nút Submit và Cancel */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button" // Quan trọng: type="button" để không submit form
                            onClick={handleClose} // Gọi hàm reset và đóng khi Hủy
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit" // Type submit để kích hoạt onSubmit của form
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            Thêm User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUserModal;