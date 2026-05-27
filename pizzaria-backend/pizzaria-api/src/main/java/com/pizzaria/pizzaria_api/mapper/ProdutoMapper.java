package com.pizzaria.pizzaria_api.mapper;

import com.pizzaria.pizzaria_api.dto.ProdutoResponse;
import com.pizzaria.pizzaria_api.entity.Produto;

public final class ProdutoMapper {

    private ProdutoMapper() {
    }

    public static ProdutoResponse toResponse(Produto produto) {
        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPreco(),
                produto.getImagemUrl(),
                CategoriaMapper.toResponse(produto.getCategoria()),
                produto.getAtivo()
        );
    }
}
