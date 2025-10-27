package com.logitrack.user; // Đảm bảo package khớp

import com.logitrack.common.dto.CreateUserRequest; // Import DTO tạo user
import com.logitrack.common.dto.UpdateUserRequest; // <<< IMPORT DTO CẬP NHẬT
import com.logitrack.user.role.Role;
import com.logitrack.user.role.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*; // Import PutMapping, PathVariable
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller để quản lý các User.
 */
@RestController
@RequestMapping("/api/users") // Base path cho tất cả endpoint
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor Injection
    public UserController(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * API Lấy danh sách Users
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    /**
     * API Tạo một User mới
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username '" + request.getUsername() + "' đã tồn tại.");
        }
        if (request.getEmail() != null && !request.getEmail().isEmpty() && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email '" + request.getEmail() + "' đã được đăng ký.");
        }

        Role userRole = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ: " + request.getRole()));

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setEmail(request.getEmail());
        newUser.setFullName(request.getFullName());
        newUser.setRole(userRole);

        User savedUser = userRepository.save(newUser);

        savedUser.setPassword(null); // Không trả password về
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // --- BỔ SUNG ENDPOINT SỬA USER ---
    /**
     * API Cập nhật thông tin User (Email, FullName, Role).
     * Chỉ Admin được thực hiện.
     * @param id ID của user cần cập nhật.
     * @param request Dữ liệu cập nhật (UpdateUserRequest DTO).
     * @return User đã được cập nhật.
     */
    @PutMapping("/{id}") // Xử lý PUT /api/users/{id}
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {

        // 1. Tìm user trong DB
        User userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy user với ID: " + id));

        // 2. (Tùy chọn) Kiểm tra email mới (nếu có) có bị trùng không
        if (request.getEmail() != null && !request.getEmail().isEmpty() && !request.getEmail().equals(userToUpdate.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email '" + request.getEmail() + "' đã được đăng ký.");
            }
            userToUpdate.setEmail(request.getEmail()); // Cập nhật email
        }

        // 3. Tìm Role object mới
        if (request.getRole() != null && !request.getRole().equals(userToUpdate.getRole().getName())) {
            Role newRole = roleRepository.findByName(request.getRole())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ: " + request.getRole()));
            userToUpdate.setRole(newRole); // Cập nhật role
        }

        // 4. Cập nhật các trường khác
        if (request.getFullName() != null) {
            userToUpdate.setFullName(request.getFullName()); // Cập nhật fullName
        }

        // (Chúng ta không cập nhật password ở đây, cần một endpoint riêng nếu muốn)

        // 5. Lưu user đã cập nhật
        User updatedUser = userRepository.save(userToUpdate);

        updatedUser.setPassword(null); // Không trả password về
        return ResponseEntity.ok(updatedUser); // Trả về HTTP 200 OK
    }
    // --- KẾT THÚC BỔ SUNG ---

}