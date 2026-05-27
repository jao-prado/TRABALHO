package com.pizzaria.pizzaria_api.dto;

import java.math.BigDecimal;

public record ItemPedidoResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        Integer quantidade,
        BigDecimal valorUnitario,
        BigDecimal subtotal
) {
}
