package com.logitrack.auth;

import com.logitrack.common.dto.LoginRequest;
import com.logitrack.common.util.JwtUtil;
import com.logitrack.user.User;
import com.logitrack.user.UserRepository;
import com.logitrack.user.role.Role;
import com.logitrack.user.role.RoleRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

// Lớp Service xử lý logic xác thực và đăng ký
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // Dependency Injection
    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Thực hiện đăng nhập và trả về JWT Token.
     * @param request Dữ liệu đăng nhập
     * @return JWT Token
     */
    public String login(LoginRequest request) {
        // Sử dụng AuthenticationManager để xác thực username/password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        // Lưu thông tin xác thực vào SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Lấy thông tin User để tạo JWT
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại."));

        // Tạo và trả về JWT Token
        return jwtUtil.generateToken(user.getUsername(), user.getRole().getName());
    }

    /**
     * Đăng ký tài khoản mới (chỉ cho phép vai trò CUSTOMER).
     * @param request Dữ liệu đăng ký (có thể dùng DTO riêng hoặc LoginRequest)
     * @return User đã được tạo
     */
    @Transactional
    public User register(LoginRequest request) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại.");
        }

        // Chỉ cho phép đăng ký vai trò CUSTOMER (theo TC03)
        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Vai trò CUSTOMER không tìm thấy."));

        // Tạo User mới
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getUsername() + "@temp.com"); // Email tạm
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa mật khẩu BCrypt
        newUser.setRole(customerRole);

        // Lưu vào CSDL
        return userRepository.save(newUser);
    }
}