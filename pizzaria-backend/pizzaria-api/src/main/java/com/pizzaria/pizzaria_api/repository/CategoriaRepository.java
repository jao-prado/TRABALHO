package com.pizzaria.pizzaria_api.repository;

import com.pizzaria.pizzaria_api.entity.Categoria;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    boolean existsByNomeIgnoreCase(String nome);

    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);

    List<Categoria> findByAtivoTrueOrderByNomeAsc();

    List<Categoria> findAllByOrderByNomeAsc();
}
