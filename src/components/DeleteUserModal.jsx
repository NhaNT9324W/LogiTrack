import React from 'react';

function DeleteUserModal({ isOpen, onClose, onConfirm, userToDelete }) {
    if (!isOpen || !userToDelete) {
        return null;
    }

    const handleDelete = () => {
        console.log("Confirming delete for user:", userToDelete.id); // Log ID
        // onConfirm(userToDelete.id); // Gọi hàm onConfirm (sẽ bật sau)
        onClose(); // Đóng modal
    };

    return (
        // Lớp phủ nền mờ
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Nội dung Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm"> {/* Kích thước nhỏ hơn */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    <h2 className="text-xl font-semibold text-red-700">Xác nhận Xóa</h2> {/* Màu đỏ */}
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>

                <div className="my-4">
                    <p className="text-gray-700">
                        Bạn có chắc chắn muốn xóa người dùng <strong className="font-medium">{userToDelete.username}</strong> không?
                        Hành động này không thể hoàn tác.
                    </p>
                </div>

                {/* Nút Xác nhận và Hủy */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete} // Gọi hàm handleDelete khi click
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" // Màu đỏ
                    >
                        Xác nhận Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteUserModal;