package com.pizzaria.pizzaria_api.mapper;

import com.pizzaria.pizzaria_api.dto.UsuarioResponse;
import com.pizzaria.pizzaria_api.entity.Usuario;

public final class UsuarioMapper {

    private UsuarioMapper() {
    }

    public static UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getRole(),
                usuario.getAtivo(),
                usuario.getCreatedAt()
        );
    }
}
