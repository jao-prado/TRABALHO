package com.pizzaria.pizzaria_api.repository;

import com.pizzaria.pizzaria_api.entity.Pedido;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @EntityGraph(attributePaths = {"itens", "itens.produto", "enderecoEntrega", "usuario"})
    List<Pedido> findByUsuarioIdOrderByCreatedAtDesc(Long usuarioId);

    @EntityGraph(attributePaths = {"itens", "itens.produto", "enderecoEntrega", "usuario"})
    List<Pedido> findAllByOrderByCreatedAtDesc();
}
