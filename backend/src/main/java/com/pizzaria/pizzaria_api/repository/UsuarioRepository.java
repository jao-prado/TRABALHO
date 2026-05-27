package com.pizzaria.pizzaria_api.repository;

import com.pizzaria.pizzaria_api.entity.Role;
import com.pizzaria.pizzaria_api.entity.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findAllByOrderByNomeAsc();

    long countByRoleAndAtivoTrue(Role role);
}