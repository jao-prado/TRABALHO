package com.pizzaria.pizzaria_api.dto;

public record AuthResponse(
        String token,
        String tipo,
        UsuarioResponse usuario
) {
}
