package com.logitrack.user;

import com.logitrack.user.role.Role;
import jakarta.persistence.*; // Make sure FetchType is imported
import lombok.Data;

import java.time.LocalDateTime;

// Entity đại diện cho bảng 'users'
@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password; // Đã được mã hóa

    private String email;

    @Column(name = "full_name") // Recommended to match column name exactly if different
    private String fullName; // Renamed field to follow Java conventions (camelCase)

    // Liên kết với bảng roles (Nhiều User có thể có 1 Role)
    @ManyToOne(fetch = FetchType.EAGER) // Tải ngay lập tức (Eager Loading)
    @JoinColumn(name = "role_id") // 'nullable = true' is usually default for ManyToOne, adjust if needed
    private Role role;

    @Column(name = "created_at", updatable = false) // Add updatable = false for creation timestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Thiết lập thời gian tạo trước khi lưu vào CSDL
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now(); // Also set updatedAt on creation
    }

    // Thiết lập thời gian cập nhật trước khi update
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // --- Optional: Getters/Setters if not using Lombok ---
    // public Long getId() { return id; }
    // public void setId(Long id) { this.id = id; }
    // ... (other getters/setters) ...

    // --- Optional: Custom Constructor if needed ---
    // public User() {}
    // public User(...) { ... }
}