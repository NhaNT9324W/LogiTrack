import React, { useState, useEffect } from 'react';
// === ĐẢM BẢO IMPORT ĐÚNG KIỂU NAMED ===
import { getAllUsers, addUser } from '../../services/AdminService';
import AddUserModal from '../../components/AddUserModal';
import EditUserModal from '../../components/EditUserModal';   // <<< IMPORT SỬA
import DeleteUserModal from '../../components/DeleteUserModal'; // <<< IMPORT XÓA

// Cấu hình các cột cho bảng
const columns = [
    { accessorKey: 'id', header: '#' },
    { accessorKey: 'username', header: 'Username' },
    { accessorKey: 'role.name', header: 'Vai trò' },
    { accessorKey: 'email', header: 'Email' },
];

function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- STATE CHO CÁC MODALS ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);   // <<< KHAI BÁO STATE SỬA
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // <<< KHAI BÁO STATE XÓA
    const [selectedUser, setSelectedUser] = useState(null); // <<< KHAI BÁO STATE USER ĐƯỢC CHỌN
    // -------------------------

    // Hàm fetch users
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllUsers(); // Gọi hàm đã import
            const fetchedUsers = response.data.data || response.data || [];
            setUsers(fetchedUsers);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách users:", err);
            setError("Không thể tải danh sách người dùng. Vui lòng thử lại.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []); // Chỉ chạy 1 lần

    // --- HÀM MỞ/ĐÓNG MODALS ---
    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    // Hàm mở modal Sửa
    const openEditModal = (user) => {
        setSelectedUser(user); // Lưu user được chọn
        setIsEditModalOpen(true); // Mở modal
    };
    const closeEditModal = () => {
        setSelectedUser(null);
        setIsEditModalOpen(false);
    };

    // Hàm mở modal Xóa
    const openDeleteModal = (user) => {
        setSelectedUser(user); // Lưu user được chọn
        setIsDeleteModalOpen(true); // Mở modal
    };
    const closeDeleteModal = () => {
        setSelectedUser(null);
        setIsDeleteModalOpen(false);
    };
    // -------------------------

    // --- HÀM XỬ LÝ SUBMIT (Đã gọi API) ---
    const handleAddUser = async (newUser) => {
        console.log("[handleAddUser] Submitting:", newUser);
        try {
            console.log("[handleAddUser] Calling addUser API...");
            await addUser(newUser);
            console.log("[handleAddUser] API call successful!");
            closeAddModal();
            fetchUsers();
            alert("Thêm user thành công!");
        } catch (err) {
            console.error("[handleAddUser] Error calling API:", err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Đã xảy ra lỗi.";
            alert(`Lỗi thêm user:\n${errorMessage}`);
        }
    };

    const handleUpdateUser = (userId, updatedData) => {
        console.log("Updating user:", userId, updatedData);
        // TODO: Gọi API AdminService.updateUser(userId, updatedData)
        closeEditModal();
        // fetchUsers(); // Tải lại list (sẽ bật sau)
        alert("Cập nhật user thành công! (API chưa gọi)");
    };

    const handleDeleteUser = (userId) => {
        console.log("Deleting user:", userId);
        // TODO: Gọi API AdminService.deleteUser(userId)
        closeDeleteModal();
        // fetchUsers(); // Tải lại list (sẽ bật sau)
        alert("Xóa user thành công! (API chưa gọi)");
    };
    // ----------------------------------------

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">Quản lý Người dùng</h1>
                <button
                    onClick={openAddModal} // Gọi hàm mở modal Add
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                    + Thêm User
                </button>
            </div>

            {loading && <p className="text-center text-gray-500">Đang tải danh sách người dùng...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col.accessorKey} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {col.header}
                                    </th>
                                ))}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role?.name === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                user.role?.name === 'DISPATCHER' ? 'bg-yellow-100 text-yellow-800' :
                                                    user.role?.name === 'SHIPPER' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>

                                    {/* --- CẬP NHẬT onClick CHO NÚT SỬA/XÓA --- */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditModal(user)} // <<< GỌI HÀM MỞ MODAL SỬA
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(user)} // <<< GỌI HÀM MỞ MODAL XÓA
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                    {/* ------------------------- */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- RENDER CẢ 3 MODALS --- */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSubmit={handleAddUser}
            />
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleUpdateUser}
                userToEdit={selectedUser}
            />
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteUser}
                userToDelete={selectedUser}
            />
            {/* ------------------------- */}
        </div>
    );
}

export default ManageUsersPage;