package com.logitrack.user;

import com.logitrack.user.role.Role; // Import Role
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA repository cho entity {@link User}.
 * Cung cấp các thao tác CRUD chuẩn và các phương thức truy vấn tùy chỉnh.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Tìm một User theo username của họ. Dùng cho việc xác thực (Login).
     * @param username Username cần tìm kiếm.
     * @return Một Optional chứa User nếu tìm thấy, ngược lại là rỗng.
     */
    Optional<User> findByUsername(String username);

    /**
     * Đếm số lượng user được gán một vai trò (Role) cụ thể.
     * Dùng cho thống kê trên Admin Dashboard.
     * @param role Entity Role cần đếm số lượng user.
     * @return Số lượng user có vai trò được chỉ định.
     */
    long countByRole(Role role);

    // --- BỔ SUNG: Tìm User theo email (Để kiểm tra trùng lặp khi tạo mới) ---
    /**
     * Tìm một User theo địa chỉ email của họ.
     * Dùng để kiểm tra email đã tồn tại chưa trước khi tạo user mới.
     * @param email Địa chỉ email cần tìm kiếm.
     * @return Một Optional chứa User nếu tìm thấy, ngược lại là rỗng.
     */
    Optional<User> findByEmail(String email);
    // --- KẾT THÚC BỔ SUNG ---

}