package com.pizzaria.pizzaria_api.dto;

public record CategoriaResponse(
        Long id,
        String nome,
        String descricao,
        Boolean ativo
) {
}
