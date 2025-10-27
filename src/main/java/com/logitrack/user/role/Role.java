package com.logitrack.user.role;

import jakarta.persistence.*;
import lombok.Data;


// Entity đại diện cho bảng 'roles'
@Entity
@Table(name = "roles")
@Data
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên vai trò (ADMIN, DISPATCHER, SHIPPER, CUSTOMER)
    @Column(nullable = false, unique = true)
    private String name;
}