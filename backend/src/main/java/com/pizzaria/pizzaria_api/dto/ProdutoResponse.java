package com.pizzaria.pizzaria_api.dto;

import java.math.BigDecimal;

public record ProdutoResponse(
        Long id,
        String nome,
        String descricao,
        BigDecimal preco,
        String imagemUrl,
        CategoriaResponse categoria,
        Boolean ativo
) {
}
