-- V2__Insert_Roles.sql
-- Mục đích: Chèn dữ liệu vai trò mặc định vào bảng roles.

INSERT INTO roles (name) VALUES
                             ('ADMIN'),
                             ('DISPATCHER'),
                             ('SHIPPER'),
                             ('CUSTOMER');