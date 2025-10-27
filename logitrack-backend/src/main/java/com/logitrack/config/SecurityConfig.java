package com.logitrack.config; // Đảm bảo package khớp với cấu trúc dự án của bạn

import com.logitrack.auth.CustomUserDetailsService;
import com.logitrack.auth.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // <<< BỔ SUNG IMPORT
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Lớp cấu hình bảo mật chính cho ứng dụng LogiTrack.
 * Bật bảo mật web, bảo mật cấp phương thức (@PreAuthorize), cấu hình
 * xác thực JWT, CORS, và các quy tắc phân quyền.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Vẫn giữ annotation này nếu bạn muốn dùng @PreAuthorize ở đâu đó khác
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Định nghĩa bean mã hóa mật khẩu (BCrypt).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Cung cấp bean AuthenticationManager từ AuthenticationConfiguration.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Định nghĩa bean AuthenticationProvider sử dụng CustomUserDetailsService
     * và PasswordEncoder để xác thực người dùng.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Cấu hình chuỗi bộ lọc bảo mật chính.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Tắt bảo vệ CSRF vì dùng JWT (stateless)
                .csrf(AbstractHttpConfigurer::disable)
                // Bật và cấu hình CORS sử dụng bean corsConfigurationSource
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Định nghĩa các quy tắc phân quyền cho HTTP requests
                .authorizeHttpRequests(authorize -> authorize
                        // Cho phép truy cập công khai các endpoint xác thực (/api/auth/...)
                        .requestMatchers("/api/auth/**").permitAll()
                        // Cho phép các request OPTIONS trên toàn cục (cần cho CORS preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // --- CẤU HÌNH QUYỀN CHO TẤT CẢ VAI TRÒ ---

                        // ADMIN (Toàn quyền quản trị)
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users/*").hasAuthority("ROLE_ADMIN")

                        // CUSTOMER (Quyền của khách hàng)
                        .requestMatchers("/api/customer/**").hasAuthority("ROLE_CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/orders").hasAuthority("ROLE_CUSTOMER")

                        // DISPATCHER (Quyền của điều phối viên)
                        .requestMatchers("/api/dispatcher/**").hasAuthority("ROLE_DISPATCHER")
                        .requestMatchers(HttpMethod.GET, "/api/orders/pending").hasAuthority("ROLE_DISPATCHER")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/assign/*").hasAuthority("ROLE_DISPATCHER")

                        // SHIPPER (Quyền của tài xế)
                        .requestMatchers("/api/shipper/**").hasAuthority("ROLE_SHIPPER") // <<< BỔ SUNG QUY TẮC NÀY
                        .requestMatchers(HttpMethod.PUT, "/api/orders/*/status").hasAuthority("ROLE_SHIPPER")

                        // CHUNG (Customer & Dispatcher)
                        .requestMatchers(HttpMethod.GET, "/api/orders/*/track").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_DISPATCHER")

                        // ---------------------------------------------

                        // Yêu cầu xác thực (có token hợp lệ) cho bất kỳ request nào còn lại chưa khớp
                        .anyRequest().authenticated()
                )
                // Cấu hình quản lý session là STATELESS (không tạo hay sử dụng session)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Thiết lập AuthenticationProvider tùy chỉnh
                .authenticationProvider(authenticationProvider())
                // Thêm bộ lọc xác thực JWT tùy chỉnh vào trước bộ lọc username/password mặc định
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Định nghĩa bean cấu hình CORS.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép request từ server frontend development
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        // Cho phép các phương thức HTTP thông dụng mà frontend sử dụng
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Cho phép các header cần thiết cho xác thực JWT và kiểu nội dung
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        // Cho phép gửi kèm thông tin xác thực (như cookie hoặc header Authorization)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Áp dụng cấu hình CORS này cho tất cả các đường dẫn bắt đầu bằng /api/
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}