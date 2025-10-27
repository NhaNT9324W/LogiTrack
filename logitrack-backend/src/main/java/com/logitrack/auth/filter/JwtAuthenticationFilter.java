package com.logitrack.auth.filter;

import com.logitrack.auth.CustomUserDetailsService;
import com.logitrack.common.util.JwtUtil;
import io.jsonwebtoken.JwtException; // Bắt các lỗi giải mã JWT
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Filter để xử lý và xác thực JWT cho mỗi request
@Component
@SuppressWarnings("deprecation")
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    // Khai báo các đường dẫn công khai cần bỏ qua Filter
    private static final RequestMatcher PUBLIC_URLS = new AntPathRequestMatcher("/api/auth/**");
    private static final RequestMatcher OPTIONS_METHOD = new AntPathRequestMatcher("/**", HttpMethod.OPTIONS.toString());


    // Constructor đơn giản hơn, không cần HandlerMappingIntrospector
    public JwtAuthenticationFilter(CustomUserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    // Phương thức này cũng không cần @SuppressWarnings nữa vì đã có ở cấp Class
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Nếu đường dẫn là /api/auth/** HOẶC là phương thức OPTIONS, bỏ qua Filter này
        return PUBLIC_URLS.matches(request) || OPTIONS_METHOD.matches(request);
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Bỏ "Bearer "

            try {
                // Bước 1: Giải mã Token và trích xuất Username
                username = jwtUtil.extractUsername(jwt);
            } catch (JwtException e) {
                // Xử lý các lỗi giải mã JWT (Hết hạn, sai chữ ký, v.v.)
                logger.error("JWT Token không hợp lệ: {}");
                // Nếu Token không hợp lệ, username sẽ là null, và luồng xác thực sẽ bị chặn.
            }
        }

        // 2. Nếu có username và chưa được xác thực (SecurityContextHolder == null)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Bước 2: Tải UserDetails
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Bước 3: Xác thực Token và kiểm tra hết hạn
            if (jwtUtil.validateToken(jwt, userDetails)) {

                // Bước 4: Tạo đối tượng Authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Bước 5: Thiết lập SecurityContext (Xác thực thành công)
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 3. Tiếp tục chuỗi Filter.
        filterChain.doFilter(request, response);
    }
}