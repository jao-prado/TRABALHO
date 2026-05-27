package com.pizzaria.pizzaria_api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PedidoRequest(
        @NotNull Long enderecoEntregaId,
        @NotBlank @Size(max = 40) String formaPagamento,
        @Size(max = 500) String observacao,
        @NotEmpty List<@Valid ItemPedidoRequest> itens
) {
}
