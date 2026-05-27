package com.pizzaria.pizzaria_api.dto;

import com.pizzaria.pizzaria_api.entity.Role;

public record AtualizarUsuarioAdminRequest(
        Role role,
        Boolean ativo
) {
}