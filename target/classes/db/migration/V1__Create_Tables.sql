-- V1__Create_Tables.sql
-- Mục đích: Tạo cấu trúc các bảng chính cho hệ thống LogiTrack
-- Dựa trên thiết kế ERD (Doc 3 - SDD)

-- 1. Bảng roles (Vai trò)
CREATE TABLE roles (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE -- ADMIN, DISPATCHER, SHIPPER, CUSTOMER
);

-- 2. Bảng users (Người dùng)
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL, -- Mật khẩu được mã hóa bằng BCrypt
                       email VARCHAR(150),
                       full_name VARCHAR(150),
                       role_id BIGINT,
                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 3. Bảng orders (Đơn hàng)
CREATE TABLE orders (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        tracking_code VARCHAR(100) NOT NULL UNIQUE,
                        customer_id BIGINT NOT NULL,
                        dispatcher_id BIGINT, -- Người điều phối gán đơn
                        shipper_id BIGINT,     -- Tài xế được gán
                        description TEXT,
                        pickup_address VARCHAR(255),
                        delivery_address VARCHAR(255),
                        status VARCHAR(50) DEFAULT 'Pending', -- Trạng thái ban đầu
                        fee DECIMAL(12,2) DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES users(id),
                        CONSTRAINT fk_order_dispatcher FOREIGN KEY (dispatcher_id) REFERENCES users(id),
                        CONSTRAINT fk_order_shipper FOREIGN KEY (shipper_id) REFERENCES users(id)
);

-- 4. Bảng order_status_history (Lịch sử trạng thái đơn hàng)
CREATE TABLE order_status_history (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      order_id BIGINT NOT NULL,
                                      status VARCHAR(50) NOT NULL,
                                      changed_by BIGINT, -- Người thực hiện thay đổi
                                      note VARCHAR(255),
                                      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                      CONSTRAINT fk_history_order FOREIGN KEY (order_id) REFERENCES orders(id),
                                      CONSTRAINT fk_history_user FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- 5. Bảng gps_tracking (Dữ liệu tọa độ mô phỏng GPS)
CREATE TABLE gps_tracking (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              order_id BIGINT NOT NULL,
                              latitude DOUBLE NOT NULL,
                              longitude DOUBLE NOT NULL,
                              recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT fk_gps_order FOREIGN KEY (order_id) REFERENCES orders(id)
);