package com.pizzaria.pizzaria_api.dto;

import com.pizzaria.pizzaria_api.entity.StatusPedido;
import jakarta.validation.constraints.NotNull;

public record AlterarStatusPedidoRequest(
        @NotNull StatusPedido status
) {
}
