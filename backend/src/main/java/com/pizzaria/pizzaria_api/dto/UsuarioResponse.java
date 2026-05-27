package com.pizzaria.pizzaria_api.dto;

import com.pizzaria.pizzaria_api.entity.Role;
import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        Role role,
        Boolean ativo,
        LocalDateTime createdAt
) {
}
