import React, { useState, useEffect } from 'react';

function EditUserModal({ isOpen, onClose, onSubmit, userToEdit }) {
    // State để lưu trữ dữ liệu form
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState(''); // Role sẽ lấy từ userToEdit

    // useEffect để cập nhật form khi userToEdit thay đổi (khi modal mở)
    useEffect(() => {
        if (userToEdit) {
            setUsername(userToEdit.username || '');
            setEmail(userToEdit.email || '');
            setFullName(userToEdit.fullName || '');
            setRole(userToEdit.role?.name || ''); // Lấy tên role
        } else {
            // Reset form nếu không có user (phòng trường hợp lỗi)
            setUsername('');
            setEmail('');
            setFullName('');
            setRole('');
        }
    }, [userToEdit]); // Chạy lại khi userToEdit thay đổi

    // Nếu modal không mở hoặc không có user, không render
    if (!isOpen || !userToEdit) {
        return null;
    }

    // Hàm xử lý khi submit form (chưa gọi API)
    const handleSubmit = (e) => {
        e.preventDefault();
        // Chỉ gửi những trường có thể cập nhật (không gửi password ở đây)
        const updatedUserData = { email, fullName, role };
        console.log("Submitting updated user:", userToEdit.id, updatedUserData); // Log ID và data
        // onSubmit(userToEdit.id, updatedUserData); // Gọi hàm onSubmit (sẽ bật sau)
        onClose(); // Đóng modal
    };

    const handleClose = () => {
        onClose(); // Chỉ đóng modal
    }

    return (
        // Lớp phủ nền mờ
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Nội dung Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Chỉnh sửa Người Dùng: {username}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username (Chỉ hiển thị, không cho sửa) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            readOnly // Không cho sửa username
                            disabled
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="edit-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="edit-fullName" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                        <input
                            type="text"
                            id="edit-fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Role (Dropdown) */}
                    <div>
                        <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">Vai trò <span className="text-red-500">*</span></label>
                        <select
                            id="edit-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="SHIPPER">SHIPPER</option>
                            <option value="DISPATCHER">DISPATCHER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>

                    {/* (Có thể thêm input đổi mật khẩu ở đây nếu cần) */}

                    {/* Nút Submit và Cancel */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors" // Đổi màu nút
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUserModal;