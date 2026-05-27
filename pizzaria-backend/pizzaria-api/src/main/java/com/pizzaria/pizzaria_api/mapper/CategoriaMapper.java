package com.pizzaria.pizzaria_api.mapper;

import com.pizzaria.pizzaria_api.dto.CategoriaResponse;
import com.pizzaria.pizzaria_api.entity.Categoria;

public final class CategoriaMapper {

    private CategoriaMapper() {
    }

    public static CategoriaResponse toResponse(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.getAtivo()
        );
    }
}
