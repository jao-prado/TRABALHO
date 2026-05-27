package com.pizzaria.pizzaria_api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProdutoRequest(
        @NotBlank @Size(max = 120) String nome,
        @Size(max = 500) String descricao,
        @NotNull @DecimalMin(value = "0.01") BigDecimal preco,
        @Size(max = 500) String imagemUrl,
        @NotNull Long categoriaId,
        Boolean ativo
) {
}
