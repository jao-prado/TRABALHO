package com.pizzaria.pizzaria_api.controller;

import com.pizzaria.pizzaria_api.dto.AlterarStatusPedidoRequest;
import com.pizzaria.pizzaria_api.dto.PedidoRequest;
import com.pizzaria.pizzaria_api.dto.PedidoResponse;
import com.pizzaria.pizzaria_api.service.PedidoService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse criar(@Valid @RequestBody PedidoRequest request, Principal principal) {
        return pedidoService.criar(principal.getName(), request);
    }

    @GetMapping("/meus")
    public List<PedidoResponse> meusPedidos(Principal principal) {
        return pedidoService.listarMeusPedidos(principal.getName());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ATENDENTE', 'ADMIN')")
    public List<PedidoResponse> listarTodos() {
        return pedidoService.listarTodos();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ATENDENTE', 'ADMIN')")
    public PedidoResponse alterarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AlterarStatusPedidoRequest request
    ) {
        return pedidoService.alterarStatus(id, request);
    }
}
