package com.logitrack.auth;

import com.logitrack.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Lớp Service để tải thông tin người dùng từ CSDL cho Spring Security
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Phương thức bắt buộc của UserDetailsService
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tìm user theo username
        return userRepository.findByUsername(username)
                // Nếu tìm thấy, tạo CustomUserDetails, ngược lại ném ngoại lệ
                .map(CustomUserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với username: " + username));
    }
}