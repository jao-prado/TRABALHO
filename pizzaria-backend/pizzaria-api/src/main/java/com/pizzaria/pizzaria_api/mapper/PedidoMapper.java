package com.pizzaria.pizzaria_api.mapper;

import com.pizzaria.pizzaria_api.dto.ItemPedidoResponse;
import com.pizzaria.pizzaria_api.dto.PedidoResponse;
import com.pizzaria.pizzaria_api.entity.ItemPedido;
import com.pizzaria.pizzaria_api.entity.Pedido;

public final class PedidoMapper {

    private PedidoMapper() {
    }

    public static PedidoResponse toResponse(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                UsuarioMapper.toResponse(pedido.getUsuario()),
                EnderecoMapper.toResponse(pedido.getEnderecoEntrega()),
                pedido.getStatus(),
                pedido.getFormaPagamento(),
                pedido.getValorTotal(),
                pedido.getObservacao(),
                pedido.getCreatedAt(),
                pedido.getItens().stream().map(PedidoMapper::toItemResponse).toList()
        );
    }

    private static ItemPedidoResponse toItemResponse(ItemPedido item) {
        return new ItemPedidoResponse(
                item.getId(),
                item.getProduto().getId(),
                item.getProduto().getNome(),
                item.getQuantidade(),
                item.getValorUnitario(),
                item.getSubtotal()
        );
    }
}
