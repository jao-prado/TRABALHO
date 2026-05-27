package com.pizzaria.pizzaria_api.dto;

import com.pizzaria.pizzaria_api.entity.StatusPedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
        Long id,
        UsuarioResponse usuario,
        EnderecoResponse enderecoEntrega,
        StatusPedido status,
        String formaPagamento,
        BigDecimal valorTotal,
        String observacao,
        LocalDateTime createdAt,
        List<ItemPedidoResponse> itens
) {
}
