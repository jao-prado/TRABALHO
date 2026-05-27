package com.pizzaria.pizzaria_api.repository;

import com.pizzaria.pizzaria_api.entity.Produto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivoTrueOrderByNomeAsc();

    List<Produto> findByCategoriaIdAndAtivoTrueOrderByNomeAsc(Long categoriaId);

    List<Produto> findAllByOrderByNomeAsc();
}
