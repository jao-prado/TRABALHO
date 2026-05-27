package com.pizzaria.pizzaria_api.service;

import com.pizzaria.pizzaria_api.dto.AlterarStatusPedidoRequest;
import com.pizzaria.pizzaria_api.dto.ItemPedidoRequest;
import com.pizzaria.pizzaria_api.dto.PedidoRequest;
import com.pizzaria.pizzaria_api.dto.PedidoResponse;
import com.pizzaria.pizzaria_api.entity.Endereco;
import com.pizzaria.pizzaria_api.entity.ItemPedido;
import com.pizzaria.pizzaria_api.entity.Pedido;
import com.pizzaria.pizzaria_api.entity.Produto;
import com.pizzaria.pizzaria_api.entity.StatusPedido;
import com.pizzaria.pizzaria_api.entity.Usuario;
import com.pizzaria.pizzaria_api.exception.ApiException;
import com.pizzaria.pizzaria_api.mapper.PedidoMapper;
import com.pizzaria.pizzaria_api.repository.PedidoRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioService usuarioService;
    private final EnderecoService enderecoService;
    private final ProdutoService produtoService;

    public PedidoService(
            PedidoRepository pedidoRepository,
            UsuarioService usuarioService,
            EnderecoService enderecoService,
            ProdutoService produtoService
    ) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioService = usuarioService;
        this.enderecoService = enderecoService;
        this.produtoService = produtoService;
    }

    @Transactional
    public PedidoResponse criar(String email, PedidoRequest request) {
        Usuario usuario = usuarioService.buscarAtivoPorEmail(email);
        Endereco enderecoEntrega = enderecoService.buscarDoUsuario(request.enderecoEntregaId(), usuario);

        Pedido pedido = Pedido.builder()
                .usuario(usuario)
                .enderecoEntrega(enderecoEntrega)
                .status(StatusPedido.PENDENTE)
                .formaPagamento(request.formaPagamento().trim())
                .observacao(request.observacao())
                .valorTotal(BigDecimal.ZERO)
                .build();

        for (ItemPedidoRequest itemRequest : request.itens()) {
            Produto produto = produtoService.buscarEntidadePorId(itemRequest.produtoId());

            if (!produto.getAtivo()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Produto indisponivel: " + produto.getNome());
            }

            BigDecimal subtotal = produto.getPreco().multiply(BigDecimal.valueOf(itemRequest.quantidade()));
            ItemPedido item = ItemPedido.builder()
                    .pedido(pedido)
                    .produto(produto)
                    .quantidade(itemRequest.quantidade())
                    .valorUnitario(produto.getPreco())
                    .subtotal(subtotal)
                    .build();

            pedido.getItens().add(item);
            pedido.setValorTotal(pedido.getValorTotal().add(subtotal));
        }

        return PedidoMapper.toResponse(pedidoRepository.save(pedido));
    }

    public List<PedidoResponse> listarMeusPedidos(String email) {
        Usuario usuario = usuarioService.buscarAtivoPorEmail(email);

        return pedidoRepository.findByUsuarioIdOrderByCreatedAtDesc(usuario.getId())
                .stream()
                .map(PedidoMapper::toResponse)
                .toList();
    }

    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(PedidoMapper::toResponse)
                .toList();
    }

    @Transactional
    public PedidoResponse alterarStatus(Long id, AlterarStatusPedidoRequest request) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Pedido nao encontrado."));

        pedido.setStatus(request.status());
        return PedidoMapper.toResponse(pedido);
    }
}
