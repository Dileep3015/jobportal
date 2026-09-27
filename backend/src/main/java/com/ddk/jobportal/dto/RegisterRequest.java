package com.ddk.jobportal.dto;

import com.ddk.jobportal.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    private String fullName;

    private String email;

    private String password;

    private String phone;

    private Role role;
}