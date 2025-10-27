package com.logitrack.user.role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repository để thao tác với bảng roles
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Tìm Role theo tên (ví dụ: "ADMIN", "CUSTOMER")
    Optional<Role> findByName(String name);
}