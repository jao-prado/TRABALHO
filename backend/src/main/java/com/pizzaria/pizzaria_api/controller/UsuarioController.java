package com.pizzaria.pizzaria_api.controller;

import com.pizzaria.pizzaria_api.dto.AtualizarUsuarioAdminRequest;
import com.pizzaria.pizzaria_api.dto.UsuarioResponse;
import com.pizzaria.pizzaria_api.service.UsuarioService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponse> listarTodos() {
        return usuarioService.listarTodos();
    }

    @PatchMapping("/{id}")
    public UsuarioResponse atualizarAdmin(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarUsuarioAdminRequest request
    ) {
        return usuarioService.atualizarAdmin(id, request);
    }
}