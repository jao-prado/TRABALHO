package com.pizzaria.pizzaria_api.controller;

import com.pizzaria.pizzaria_api.dto.EnderecoRequest;
import com.pizzaria.pizzaria_api.dto.EnderecoResponse;
import com.pizzaria.pizzaria_api.service.EnderecoService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    private final EnderecoService enderecoService;

    public EnderecoController(EnderecoService enderecoService) {
        this.enderecoService = enderecoService;
    }

    @GetMapping
    public List<EnderecoResponse> listar(Principal principal) {
        return enderecoService.listarDoUsuario(principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnderecoResponse criar(@Valid @RequestBody EnderecoRequest request, Principal principal) {
        return enderecoService.criar(principal.getName(), request);
    }
}
